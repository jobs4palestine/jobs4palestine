export interface IResultBase {
    position: number;
    title: string;
    link: string;
    redirect_link?: string;
    displayed_link?: string;
    domain: string;
    snippet: string;
    speciality: Speciality
    date_published_raw?: string;
    date_published?: Date;
    searchTerm: string;
    archived: boolean;
    about_this_result?: {
        source?: {
            description?: string;
            source_info_link?: string;
            security?: string;
            icon?: string;
        };
        keywords?: string[];
        languages?: string[];
    };
    about_page_link?: string;
    about_page_serpapi_link?: string;
    cached_page_link?: string;
    created_at?: Date;
    updated_at?: Date;
}
export interface APIResult extends IResultBase {
    _id: string;
}


export type Speciality =
    | 'Java'
    | 'J2EE'
    | 'Spring'
    | 'Android'
    | 'iOS'
    | 'React'
    | 'React-Native'
    | 'GoLang'
    | 'QA (Quality Assurance)'
    | 'Fullstack'
    | 'Python'
    | 'C#'
    | 'Angular'
    | 'Ruby'
    | 'Flutter'
    | 'Node.js';