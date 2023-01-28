import {Injector} from "@sailplane/injector";
import {Logger} from "@sailplane/logger";
import {
    ClaimDocument,
    ClaimsSummaryModel,
    CurrentClaimsInformationModel, HistoricalClaimsInformationModel,
    HistoricalClaimsSummaryModel
} from "./claim.models";
import {parseCsvStringAsync} from "../utils/csv.util";
import {ClaimRepository} from "./claim.repository";
import {isNull, isUndefined} from "lodash";
import * as createError from "http-errors";
import mongoose from "mongoose";

mongoose.set('strictQuery', false);


const logger = new Logger("ClaimService");
const HEADERS = ['index', 'amount', 'proofs', 'week', 'account', 'merkle_root'];
const DB_NAME = 'ba'

export class ClaimService {

    constructor(private readonly claimRepository: ClaimRepository) {
    }

    async putClaimsFromCSVString(csvContent: string) {
        await mongoose.connect(process.env.MONGODB_URI!, {dbName: DB_NAME});

        logger.info(`csvContent length ${csvContent.length}`)

        const records = await parseCsvStringAsync(csvContent, HEADERS, true) as ClaimDocument[]
        const claimsSummary = []
        const claimsSummaryHistorical = []
        const claimsInformation = []
        const historicalClaimsInformation = []

        for (const record of records) {
            logger.info(`records: ${JSON.stringify(record)}`)
            claimsSummary.push(new ClaimsSummaryModel(record))
            claimsSummaryHistorical.push(new HistoricalClaimsSummaryModel(record))
            claimsInformation.push(new CurrentClaimsInformationModel(record))
            historicalClaimsInformation.push(new HistoricalClaimsInformationModel(record))
        }

        await this.claimRepository.bulkReplaceClaimsSummary(claimsSummary)
        await this.claimRepository.bulkSaveHistoricalClaimsSummary(claimsSummaryHistorical)
        await this.claimRepository.bulkReplaceCurrentClaimsInformation(claimsInformation)
        await this.claimRepository.bulkSaveHistoricalClaimsInformation(historicalClaimsInformation)

    }

    async getClaim(index: string) {
        await mongoose.connect(process.env.MONGODB_URI!, {dbName: DB_NAME});

        const claim = await this.claimRepository.getClaim(index)

        if (isNull(claim)) {
            throw new createError.NotFound(`claim with index ${index} Not Found`);

        }

        return claim as ClaimDocument;
    }
}

Injector.register(ClaimService, [ClaimRepository]);
