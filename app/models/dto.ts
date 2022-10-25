import { Company, EnrollmentStatus, Role } from '@prisma/client';
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
    pointDollarValue: number;

    constructor(companyDto: Partial<CompanyDto>) {
        this.id = companyDto.id ?? 0;
        this.name = companyDto.name ?? '';
        this.pointDollarValue = companyDto.pointDollarValue ?? 0;
    }

    static fromCompany(company: Company) {
        return new CompanyDto({
            ...company,
            pointDollarValue: company.pointDollarValue.toFixed(2)
        })
    }
}

export class PurchaseDto {
    //createdAt: Date
    catalogItem: string
    catalogItemId: number
    purchaseStatus: string
    driver: string
    cashvalue: number

    constructor(purchaseDto: Partial<PurchaseDto>){
        //this.createdAt = purchaseDto.createdAt ?? undefined
        this.catalogItem = purchaseDto.catalogItem ?? ''
        this.catalogItemId = purchaseDto.catalogItemId ?? 0
        this.purchaseStatus = purchaseDto.purchaseStatus ?? ''
        this.driver = purchaseDto.driver ?? ''
        this.cashvalue = purchaseDto.cashvalue ?? 0
    }
}