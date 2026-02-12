
import { validate } from 'class-validator'
import { UpdateLessonDto } from './src/builder/dto/builder.dto'
import { plainToInstance } from 'class-transformer'

async function check() {
    const payload = {
        title: "4444",
        order: null, // Test if null order fails
        contentRich: null,
    }

    const dto = plainToInstance(UpdateLessonDto, payload)
    const errors = await validate(dto, { whitelist: true })

    if (errors.length > 0) {
        console.log('❌ Validation Errors:', JSON.stringify(errors, null, 2))
    } else {
        console.log('✅ Validation Passed!')
    }
}

check().catch(console.error)
