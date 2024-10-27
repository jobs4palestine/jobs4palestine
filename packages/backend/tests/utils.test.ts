// utils.test.ts
import {queryForSpecialty} from "../src/utils";

const allSpecialities = [
    'Java',
    'J2EE',
    'Spring',
    'Android',
    'iOS',
    'React',
    'React-Native',
    'GoLang',
    'QA (Quality Assurance)',
    'Fullstack',
    'Python',
    'C#',
    'Angular',
    'Ruby',
    'Flutter',
    'Node.js'
] as const;


describe('queryForSpecialty', () => {
    it('should print query results for all specialties', () => {
        const sites = "example.com, anotherexample.com";
        allSpecialities.forEach((speciality) => {
            const query = queryForSpecialty(speciality, sites);
            console.log(`Query for ${speciality}: ${query}`);
        });
    });
});
