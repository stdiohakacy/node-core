import * as MailGen from 'mailgen'

export class MailGenerator {
    private readonly _mailGenerator: MailGen

    constructor() {
        this._mailGenerator = new MailGen({
            theme: 'default',
            product: {
                name: 'Node Core',
                link: `http://localhost`
            }
        })
    }

    generatePlainText(params: MailGen.Content): string {
        return this._mailGenerator.generatePlaintext(params)
    }

    generateHtmlContent(params: MailGen.Content): string {
        return this._mailGenerator.generate(params)
    }
}
