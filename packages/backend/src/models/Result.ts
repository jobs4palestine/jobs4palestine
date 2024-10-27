import { Model, Document, Schema, model } from 'mongoose';
import type {IResultBase, Speciality} from '@jobs4palestine/shared';

// Then extend it for the Document
interface IResult extends IResultBase, Document {}

// Create Model type
interface IResultModel extends Model<IResult> {
    // Add any static methods here if needed
}

const ResultSchema = new Schema<IResult>({
    position: { type: Number },
    title: { type: String, required: true },
    link: { type: String, required: true },
    redirect_link: String,
    displayed_link: String,
    domain: { type: String, required: true },
    snippet: { type: String, required: true },
    speciality: String,
    date_published_raw: String,
    date_published: Date,
    searchTerm: { type: String, required: true },
    archived: { type: Boolean, default: false },
    about_this_result: {
        source: {
            description: String,
            source_info_link: String,
            security: String,
            icon: String
        },
        keywords: [String],
        languages: [String]
    },
    about_page_link: String,
    about_page_serpapi_link: String,
    cached_page_link: String
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Create and export the model
const ResultModel = model<IResult, IResultModel>('Result', ResultSchema);

// Update the validation function
function validateSearchResult(result: any): result is IResultBase {
    return (
        typeof result.title === 'string' &&
        typeof result.link === 'string' &&
        typeof result.domain === 'string' &&
        typeof result.snippet === 'string'
    );
}
async function getAllResults(): Promise<IResult[]> {
    try {
        // Fetch all documents in the 'results' collection
        const results = await ResultModel.find();
        return results;
    } catch (error) {
        console.error('Error fetching search results:', error);
        throw error;
    }
}

export async function getResultsBySpeciality(speciality: Speciality): Promise<IResult[]> {
    try {
        const results = await ResultModel.find({ speciality });
        return results;
    } catch (error) {
        console.error('Error fetching results by speciality:', error);
        throw error;
    }
}

// Update the save function
async function saveSearchResults(searchResults: Partial<IResultBase>[]) {
    try {
        const validResults = searchResults.filter(validateSearchResult);

        if (validResults.length !== searchResults.length) {
            console.warn(`${searchResults.length - validResults.length} results were invalid and filtered out`);
        }

        const savedResults = [];
        for (const result of validResults) {
            const newResult = new ResultModel(result);
            const savedResult = await newResult.save(); // Save each result individually
            savedResults.push(savedResult);
        }
        return savedResults;
    } catch (error) {
        console.error('Error saving search results:', error);
        throw error;
    }
}


export {
    IResultBase,
    IResult,
    IResultModel,
    ResultSchema,
    validateSearchResult,
    saveSearchResults,
    getAllResults
};
export default ResultModel;
