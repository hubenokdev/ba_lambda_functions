import {parse} from 'csv-parse';
import {finished} from 'stream/promises';
import {ClaimDocument} from "../claim/claim.models";
import {Logger} from "@sailplane/logger";

const logger = new Logger("csvUtil");

export const parseCsvStringAsync = async (content: string, headers: string[], ignoreHeader: boolean = false) => {

    const records = await new Promise((resolve, reject) => {
        parse(content, {
            delimiter: ',',
            columns: headers,
            fromLine: ignoreHeader ? 2 : 1 // ignore header
        }, function (err, rows) {
            resolve(rows);
        });
    })
    // const parser = parse(content, {
    //     delimiter: ',',
    //     columns: headers,
    //     fromLine: ignoreHeader ? 2 : 1 // ignore header
    // },)
    //
    // parser.on("readable", function (result: ClaimDocument[]) {
    //     logger.info("readablereadablereadable")
    //
    //     records = result
    // })
    //
    // parser.on("data", function (result: ClaimDocument[]) {
    //     logger.info("datadatadatadata")
    // })
    //
    // parser.on('error', function () {
    //     throw new Error('Error while parsing the csv file')
    // })
    //
    // await finished(parser);
    return records;

};
