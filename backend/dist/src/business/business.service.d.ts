import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
export declare class BusinessService {
    private db;
    constructor(db: DrizzleDB);
    create(createBusinessDto: CreateBusinessDto): string;
    findAll(): Promise<{
        id: number;
        name: string;
        category: string;
        registrationStatus: string;
        ownerId: number;
        createdAt: Date;
    }[]>;
    findOne(id: number): string;
    update(id: number, updateBusinessDto: UpdateBusinessDto): Promise<import("pg").QueryResult<never>>;
    remove(id: number): Promise<import("pg").QueryResult<never>>;
}
