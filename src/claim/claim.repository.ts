import {Injector} from "@sailplane/injector";
import {Logger} from "@sailplane/logger";
import {
    ClaimsSummaryModel,
    CurrentClaimsInformationModel,
    HistoricalClaimsInformationModel,
    HistoricalClaimsSummaryModel, ClaimDocument
} from "./claim.models";

const logger = new Logger("ClaimRepository");


export class ClaimRepository {
    async bulkReplaceClaimsSummary(claims: ClaimDocument[]) {
        await ClaimsSummaryModel.deleteMany({})

        await ClaimsSummaryModel.bulkSave(claims);
        logger.info(`bulkReplaceClaimsSummary replaced, documents stored:${claims.length}`)
    }

    async bulkReplaceCurrentClaimsInformation(claims: ClaimDocument[]) {
        await CurrentClaimsInformationModel.deleteMany({})

        await CurrentClaimsInformationModel.bulkSave(claims);
        logger.info(`bulkReplaceCurrentClaimsInformation replaced, documents stored:${claims.length}`)
    }

    async bulkSaveHistoricalClaimsInformation(claims: ClaimDocument[]) {
        await HistoricalClaimsInformationModel.bulkSave(claims);

        logger.info(`bulkSaveHistoricalClaimsInformation, documents added:${claims.length}`)
    }

    async bulkSaveHistoricalClaimsSummary(records: ClaimDocument[]) {

        await HistoricalClaimsSummaryModel.bulkSave(records);
        logger.info(`bulkSaveHistoricalClaimsSummary, documents added:${records.length}`)

    }

    async getClaim(index: string) {
        logger.info(`getClaim index ${index}`)
        return HistoricalClaimsSummaryModel.findOne({index});
    }
}

Injector.register(ClaimRepository);
