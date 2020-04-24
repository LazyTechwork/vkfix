import ConfigField from "./ConfigField";

export default class VKFixConfig {
    public config_id: string
    public fields: ConfigField[]
    private config_node: Node | HTMLElement | Element | null = null

    private modalGenerator() {
        for (const field of this.fields) {

        }
    }

    open(parent: Node) {

    }

    close() {

    }
}