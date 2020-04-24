export default class ConfigField {
    public type: 'section' | 'checkbox' | 'text' | 'select'
    public id: string
    public default: any
}