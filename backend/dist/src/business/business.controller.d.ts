import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
export declare class BusinessController {
    private readonly businessService;
    constructor(businessService: BusinessService);
    create(createBusinessDto: CreateBusinessDto): string;
    findAll(): Promise<{
        id: number;
        name: string;
        category: string;
        registrationStatus: string;
        ownerId: number;
        createdAt: Date;
    }[]>;
    findOne(id: string): string;
    update(id: string, updateBusinessDto: UpdateBusinessDto): Promise<import("pg").QueryResult<never>>;
    remove(id: string): Promise<import("pg").QueryResult<never>>;
}
