import BaseSchema from './base-schema';

export class ValidSchema extends BaseSchema<any> {
        get type() {
                return 'valid';
        }

        public validateType(value: any): value is any {
                return true;
        }

        public validate(value: any, path: string) {
                return { errors: [], errorsCount: 0, corrected: value };
        }
}

export default new ValidSchema;
