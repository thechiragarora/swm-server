import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';

class VersionableRepository<D extends mongoose.Document, M extends mongoose.Model<D>> {
    public static generate(): string {
        return String(mongoose.Types.ObjectId());
    }
    private model: M;
    constructor(Model) {
        this.model = Model;
    }

    public genericCount(): mongoose.Query<number> {
        return this.model.countDocuments();
    }
    public genericCreate(data, flag): Promise<D> {
        const id = VersionableRepository.generate();
        if (flag === true) {
            const hash = bcrypt.hashSync(data.password, 10);
            return this.model.create({...data, originalID: id, _id: id, password: hash});
        }
        else {
            return this.model.create({...data, createdAt: Date.now(), _id: id});
        }
    }
    public async genericDelete(data): Promise<any> {
        const fetch = await this.genericFindOne({_id: data.id, deleted: {$exists: false}}).lean();
        if (fetch !== null) {
            return this.model.updateOne({ _id: data.id }, {deleted: true} , (err) => {
                if (err) {
                    throw err;
                }
            });
        }
        else {
            // tslint:disable-next-line:no-string-throw
            throw ('Data not Found');
        }
    }
    public async genericUpdate(data, previousId): Promise<D> {
        const fetch = await this.genericFindOne({originalID: previousId, updatedAt: {$exists: false}}).lean();
        const newData: object = Object.assign(fetch, data);
        const result =  await this.genericCreate(newData, false);
        this.model.updateOne({ originalID: previousId }, {updatedAt: Date.now()} , (err) => {
            if (err) {
                throw err;
            }
        });
        return result;
    }
    public genericFindOne(data): mongoose.DocumentQuery<D, D> {
        return this.model.findOne(data, (err) => {
            if (err) {
                throw err;
            }
        } );
    }
    public genericFindAll(data, value, value2): mongoose.DocumentQuery<D[], D>  {
        const tempValue: number = Number(value);
        const tempValue2: number = Number(value2);
        // tslint:disable-next-line:no-null-keyword
        return this.model.find(data, null, { skip: tempValue, limit: tempValue2 }, (err, result) => {
            if (err) {
                throw err;
            }
        } );
    }
}
export default VersionableRepository;
