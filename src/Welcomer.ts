import { Base } from "discord-canvas";
import Util from "./Util";

type ID = 'title' | 'title-border' | 'avatar' | 'username' | 'username-box' | 'hashtag' | 'discriminator' | 'discriminator-box' | 'message' | 'message-box' | 'member-count' | 'background' | 'border';

class Welcomer extends Base {
	public textTitle: any;
	public textMessage: any;
	public colorTitle: any;
	public setUsername: any;
	public setDiscriminator: any;
	public setGuildName: any;
	public setAvatar: any;
	public toAttachment: any;

    /**
     * Welcome image builder
     * @see https://www.discord-canvas.net/functions/welcome
     * @example
     * const card = new canvacord.Welcomer()
            .setUsername("Snowflake")
            .setDiscriminator("0007")
            .setGuildName("Snowflake Studio");

        card.build()
            .then(data => {
                canvacord.write(data, "welcomer.png");
            })
     */
    constructor() {
        super();

        /**
         * Title created with Canvacord
         * @type {string}
         */
        this.textTitle = "WELCOME";

        /**
         * Text message created with Canvacord
         * @type {string}
         */
        this.textMessage = "Welcome to {server}";

        /**
         * Title color created with canvacord
         * @type {string}
         */
        this.colorTitle = "#03A9F4";
        
        // update default data
        this.__updateData();
    }

    /**
     * Updates default state
     * @private
     * @ignore
     */
    __updateData() {
        this.setUsername("Discord User");
        this.setDiscriminator("0000");
        this.setMemberCount(100);
        this.setGuildName("Discord Server");
        this.setAvatar(`https://cdn.discordapp.com/embed/avatars/0.png`);
        this.setColor("border", "#4D5E94");
        this.setColor("username-box", "#4D5E94");
        this.setColor("discriminator-box", "#4D5E94");
        this.setColor("message-box", "#4D5E94");
        this.setColor("title", "#4D5E94");
        this.setColor("avatar", "#4D5E94");
    }

    /**
     * Set color
     * @param {("title"|"title-border"|"avatar"|"username"|"username-box"|"hashtag"|"discriminator"|"discriminator-box"|"message"|"message-box"|"member-count"|"background"|"border")} id
     * @param {string} color HTML5 color code
     * @returns {Welcomer}
     */
    setColor(id: ID, color: string): Welcomer {
        super.setColor(id, color);
        return this;
    }

    /**
     * Ser member count
     * @param {number|string} memberCount Guild member count
     * @returns {Welcomer}
     */
    setMemberCount(memberCount = 100): Welcomer {
        super.setMemberCount(Util.toAbbrev(memberCount));
        return this;
    }

    /**
     * Builds welcome image
     * @returns {Promise<Buffer>}
     */
    async build(): Promise<Buffer> {
        return (await this.toAttachment()).toBuffer();
    }

}

export default Welcomer;
