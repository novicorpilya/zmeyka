import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { writeFileSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

const execAsync = promisify(exec)

export interface ExecutionResult {
  stdout: string
  stderr: string
  output: string
  code: number
  signal: string | null
}

interface PistonResponse {
  run: {
    stdout: string
    stderr: string
    output: string
    code: number
    signal: string | null
  }
}

@Injectable()
export class ExecutionService {
  private readonly logger = new Logger(ExecutionService.name)
  private readonly pistonUrl: string

  constructor(private readonly prisma: PrismaService) {
    // Use environment variable or default to Public Piston
    const requestedUrl = process.env.PISTON_URL || 'https://emkc.org/api/v2/piston/execute'

    // BIG TECH SECURITY AUDIT: Prevent local execution in production
    if (requestedUrl === 'NATIVE' && process.env.NODE_ENV === 'production') {
      this.logger.error(
        '❌ CRITICAL SECURITY ALERT: Native execution is FORBIDDEN in production mode. Falling back to safe Piston API.',
      )
      this.pistonUrl = 'https://emkc.org/api/v2/piston/execute'
    } else {
      this.pistonUrl = requestedUrl
    }

    if (this.pistonUrl === 'NATIVE') {
      this.logger.log('🚀 NATIVE MODE: Using local Python interpreter for execution')
    } else if (this.pistonUrl.includes('emkc.org')) {
      this.logger.warn('⚠️ PUBLIC MODE: Using emkc.org Piston API (requires internet)')
    } else {
      this.logger.log(`🔗 PISTON MODE: Using service at ${this.pistonUrl}`)
    }
  }

  async runPython(code: string, userId?: string, lessonId?: string): Promise<ExecutionResult> {
    if (this.pistonUrl === 'NATIVE') {
      return this.runNative(code, userId, lessonId)
    }

    let executionSuccess = false
    let output = ''
    let errorMsg = ''
    try {
      const controller = new AbortController()
      const timeoutId = globalThis.setTimeout(() => controller.abort(), 15000) // 15s for public API

      const response = await globalThis.fetch(this.pistonUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: 'python',
          version: '3.10.0', // Standard Piston python version
          files: [{ content: code }],
          run_timeout: 3000,
          compile_timeout: 5000,
        }),
        signal: controller.signal,
      })
      globalThis.clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Execution API error: ${response.status} ${response.statusText}`)
      }

      const data = (await response.json()) as PistonResponse
      const run = data.run
      const MAX_OUTPUT = 2000

      executionSuccess = run.code === 0
      output = (run.stdout || '').slice(0, MAX_OUTPUT)
      errorMsg = (run.stderr || '').slice(0, MAX_OUTPUT)

      // Log asynchronously
      if (userId) {
        void this.saveLog(userId, lessonId, code, output, errorMsg, executionSuccess)
      }

      return {
        stdout: output,
        stderr: errorMsg,
        output: (run.output || '').slice(0, MAX_OUTPUT),
        code: run.code,
        signal: run.signal,
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      this.logger.error(`Execution failed: ${errorMessage}`)

      if (userId) {
        void this.saveLog(userId, lessonId, code, '', errorMessage, false)
      }

      return {
        stdout: '',
        stderr: 'Connection to execution server failed',
        output: `Network Error: ${errorMessage}`,
        code: 1,
        signal: null,
      }
    }
  }

  private async runNative(
    code: string,
    userId?: string,
    lessonId?: string,
  ): Promise<ExecutionResult> {
    const fileName = `zmeyka_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.py`
    const filePath = join(tmpdir(), fileName)

    try {
      // 1. Write temp file
      // Add turtle.done() if it's a turtle script to keep the window open
      let modifiedCode = code
      if (code.includes('import turtle') || code.includes('from turtle')) {
        if (!code.includes('turtle.done()') && !code.includes('mainloop()')) {
          modifiedCode += '\nimport turtle\nturtle.done()'
        }
      }
      writeFileSync(filePath, modifiedCode)

      // 2. Execute with timeout and PYTHONPATH
      const libsDir = join(process.cwd(), 'python_libs')
      const { stdout, stderr } = await execAsync(`python "${filePath}"`, {
        timeout: 30000, // Increased for GUI apps
        maxBuffer: 1024 * 1024,
        env: {
          ...process.env,
          PYTHONPATH: libsDir,
        },
      })

      const result = {
        stdout: stdout,
        stderr: stderr,
        output: stdout + (stderr ? `\n${stderr}` : ''),
        code: 0,
        signal: null,
      }

      if (userId) void this.saveLog(userId, lessonId, code, stdout, stderr, true)
      return result
    } catch (error: unknown) {
      const execError = error as {
        stdout?: string
        stderr?: string
        code?: number
        signal?: string | null
        message?: string
      }
      const stdout = execError.stdout || ''
      const stderr = execError.stderr || execError.message || String(error)
      const result = {
        stdout,
        stderr,
        output: stdout + (stderr ? `\n${stderr}` : ''),
        code: execError.code || 1,
        signal: execError.signal || null,
      }

      if (userId) void this.saveLog(userId, lessonId, code, stdout, stderr, false)
      return result
    } finally {
      // 3. Cleanup
      try {
        unlinkSync(filePath)
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e)
        this.logger.error(`Failed to cleanup temp file: ${message}`)
      }
    }
  }

  private async saveLog(
    userId: string,
    lessonId: string | undefined,
    code: string,
    output: string,
    error: string,
    success: boolean,
  ): Promise<void> {
    try {
      await this.prisma.codeExecutionLog.create({
        data: {
          userId,
          lessonId,
          code,
          output,
          error,
          success,
        },
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      this.logger.error(`Failed to save execution log: ${message}`)
    }
  }
}
