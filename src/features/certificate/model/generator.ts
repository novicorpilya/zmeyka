/**
 * Certificate Generation Logic
 * Uses HTML5 Canvas for high-quality client-side generation without external PDF libraries.
 */
export const generateCertificate = async (
  userName: string,
  courseName: string,
  date: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return reject('Canvas context not found')

    // Certificate Dimensions (A4 Landscape at 144 DPI)
    canvas.width = 1684
    canvas.height = 1191

    // 1. Draw Background
    // Premium Slate Gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, '#0f172a')
    gradient.addColorStop(1, '#1e293b')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 2. Decorative Borders
    ctx.strokeStyle = '#10b981' // emerald-500
    ctx.lineWidth = 40
    ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120)

    ctx.strokeStyle = '#3b82f6' // blue-500
    ctx.lineWidth = 10
    ctx.strokeRect(100, 100, canvas.width - 200, canvas.height - 200)

    // 3. Header Text
    ctx.fillStyle = '#10b981'
    ctx.font = 'bold 40px "Nunito", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('СЕРТИФИКАТ ОКОНЧАНИЯ КУРСА', canvas.width / 2, 250)

    // 4. Branding
    ctx.fillStyle = '#ffffff'
    ctx.font = 'black 120px "Nunito", sans-serif'
    ctx.fillText('ZMEYKA.IO', canvas.width / 2, 400)

    // 5. Main Body
    ctx.fillStyle = '#94a3b8'
    ctx.font = '30px "Nunito", sans-serif'
    ctx.fillText('Настоящий сертификат подтверждает, что', canvas.width / 2, 550)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'black 80px "Nunito", sans-serif'
    ctx.fillText(userName.toUpperCase(), canvas.width / 2, 650)

    ctx.fillStyle = '#94a3b8'
    ctx.font = '30px "Nunito", sans-serif'
    ctx.fillText('успешно завершил(а) обучение по программе:', canvas.width / 2, 750)

    ctx.fillStyle = '#10b981'
    ctx.font = 'bold 60px "Nunito", sans-serif'
    ctx.fillText(courseName, canvas.width / 2, 850)

    // 6. Footer (Date and Signature)
    ctx.fillStyle = '#64748b'
    ctx.font = '24px "Nunito", sans-serif'
    ctx.fillText(`Дата выдачи: ${date}`, canvas.width / 2, 1000)

    // Abstract "Seal" or Logo Placeholder
    ctx.beginPath()
    ctx.arc(canvas.width - 300, canvas.height - 300, 100, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(16, 185, 129, 0.1)'
    ctx.fill()
    ctx.strokeStyle = '#10b981'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.fillStyle = '#10b981'
    ctx.font = 'bold 20px "Nunito", sans-serif'
    ctx.fillText('Verified AI Assistant', canvas.width - 300, canvas.height - 300)

    // Return as Data URL
    resolve(canvas.toDataURL('image/png', 1.0))
  })
}
