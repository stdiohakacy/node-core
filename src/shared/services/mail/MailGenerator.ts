import * as Mailgen from 'mailgen';

export class MailGenerator {
    private readonly _mailGenerator: Mailgen;

    constructor() {
        this._mailGenerator = new Mailgen({
            theme: 'default',
            product: {
                // Appears in header & footer of e-mails
                name: 'Node core',
                link: `${'http'}://${'localhost'}`
                // Optional product logo
                // logo: 'https://mailgen.js/img/logo.png'
            }
        });
    }

    generatePlaintext(params: Mailgen.Content): string {
        return this._mailGenerator.generatePlaintext(params);
    }

    generateHtmlContent(params: Mailgen.Content): string {
        return this._mailGenerator.generate(params);
    }
}
