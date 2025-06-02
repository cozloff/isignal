"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_module_1 = require("../drizzle/drizzle.module");
const business_schema_1 = require("../drizzle/schema/business.schema");
const drizzle_orm_1 = require("drizzle-orm");
let BusinessService = class BusinessService {
    constructor(db) {
        this.db = db;
    }
    create(createBusinessDto) {
        return 'This action adds a new business';
    }
    async findAll() {
        return await this.db.select().from(business_schema_1.business);
    }
    findOne(id) {
        return `This action returns a #${id} business`;
    }
    async update(id, updateBusinessDto) {
        return await this.db
            .update(business_schema_1.business)
            .set({
            name: 'AAAAAAAAA',
        })
            .where((0, drizzle_orm_1.eq)(business_schema_1.business.id, id));
    }
    async remove(id) {
        return await this.db.delete(business_schema_1.business).where((0, drizzle_orm_1.eq)(business_schema_1.business.id, id));
    }
};
exports.BusinessService = BusinessService;
exports.BusinessService = BusinessService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [Object])
], BusinessService);
//# sourceMappingURL=business.service.js.map