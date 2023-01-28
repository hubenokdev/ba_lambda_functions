import {Schema, model, Document} from "mongoose";

export interface ClaimDocument extends Document {
    index: string;
    amount: string;
    proofs: string;
    week: string;
    account: string;
    merkle_root: string;
};
export const ClaimSchema = new Schema<ClaimDocument>({
    index: {type: String, required: true},
    amount: {type: String, required: true},
    proofs: {type: String, required: true},
    week: {type: String, required: true},
    account: {type: String, required: true},
    merkle_root: {type: String, required: true},
});


export const ClaimsSummaryModel = model<ClaimDocument>('claimsSummary', ClaimSchema, "claimsSummary");
export const HistoricalClaimsSummaryModel = model<ClaimDocument>('historicalClaimsSummary', ClaimSchema, "historicalClaimsSummary");
export const CurrentClaimsInformationModel = model<ClaimDocument>('currentClaimsInformation', ClaimSchema, "currentClaimsInformation");
export const HistoricalClaimsInformationModel = model<ClaimDocument>('historicalClaimsInformation', ClaimSchema, "historicalClaimsInformation");
