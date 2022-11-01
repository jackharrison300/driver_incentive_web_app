import { Company, EnrollmentStatus, PointChange, Role } from '@prisma/client';
import { UserWithSponsorWithCompany, UserWithDriverWithCompany } from './shared_prisma';

export class UserDto {
    name: string;
    email: string;
    role: Role;

    constructor(userDto: Partial<UserDto>) {
        this.name = userDto.name ?? '';
        this.email = userDto.email ?? '';
        this.role = userDto.role ?? Role.DRIVER;
    }
}

export class SponsorDto extends UserDto {
    companyName: string;

    constructor(sponsorDto: Partial<SponsorDto>) {
        super(sponsorDto);
        this.companyName = sponsorDto.companyName ?? '';
    }

    static fromUserWithSponsorWithCompany(user: UserWithSponsorWithCompany) {
        return new SponsorDto({...user, companyName: user.sponsor?.company.name });
    }
}

export class DriverDto extends UserDto {
    companyName: string;
    enrollmentStatus: EnrollmentStatus;

    constructor(driverDto: Partial<DriverDto>) {
        super(driverDto);
        this.companyName = driverDto.companyName ?? '';
        this.enrollmentStatus = driverDto.enrollmentStatus ?? EnrollmentStatus.NOT_APPLIED;
    }

    static fromUserWithDriverWithCompany(user: UserWithDriverWithCompany) {
        return new DriverDto({
            ...user,
            companyName: user.driver?.company?.name,
            enrollmentStatus: user.driver?.enrollmentStatus
        });
    }
}

export class CompanyDto {
    id: number;
    name: string;
    pointDollarValue: string;

    constructor(companyDto: Partial<CompanyDto>) {
        this.id = companyDto.id ?? 0;
        this.name = companyDto.name ?? '';
        this.pointDollarValue = companyDto.pointDollarValue ?? "0";
    }

    static fromCompany(company: Company) {
        return new CompanyDto({
            ...company,
            pointDollarValue: company.pointDollarValue.toFixed(2)
        })
    }
}

export class PurchaseDto {
    createdAt: Date
    catalogItem: string
    catalogItemId: number
    purchaseStatus: string
    driver: string
    cashvalue: number

    constructor(purchaseDto: Partial<PurchaseDto>){
        this.createdAt = purchaseDto.createdAt!
        this.catalogItem = purchaseDto.catalogItem ?? ''
        this.catalogItemId = purchaseDto.catalogItemId ?? 0
        this.purchaseStatus = purchaseDto.purchaseStatus ?? ''
        this.driver = purchaseDto.driver ?? ''
        this.cashvalue = purchaseDto.cashvalue ?? 0
    }
}

export class PtChangeDto {
    createdAt: string
    companyId: number
    driverId: number
    pointValue: number

    constructor(PtChangeDto: Partial<PtChangeDto>){
        this.createdAt = PtChangeDto.createdAt!
        this.companyId = PtChangeDto.companyId ?? 0
        this.driverId = PtChangeDto.driverId ?? 0
        this.pointValue = PtChangeDto.pointValue ?? 0
    }

    static fromPtChange(pointChange: PointChange){
        return new PtChangeDto({
            ...pointChange,
            createdAt: pointChange.createdAt.toString()
        })
    }
}