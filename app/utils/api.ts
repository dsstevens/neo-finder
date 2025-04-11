import axios from 'axios';

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export interface NeoObject {
    name: string; // near_earth_objects[date].name
    diameter: {
        average: number;
        min: number;
        max: number;
    }; // TODO !need to refactor avg logic into helper fn // near_earth_objects[date].estimated_diameter.feet
    velocity: number; //miles per hour // near_earth_objects[date].close_approach_data[0].relative_velocity.miles_per_hour
    missDistance: number; //miles // near_earth_objects[date].close_approach_data[0].miss_distance.miles
    hazardous: boolean;
}

interface NeoResponse {
    near_earth_objects: {
        [date: string]: Array<{
            name: string;
            estimated_diameter: {
                feet: {
                    estimated_diameter_min: number;
                    estimated_diameter_max: number;
                }
            };
            close_approach_data: Array<{
                relative_velocity: {
                    miles_per_hour: string;
                };
                miss_distance: {
                    miles: string;
                };
            }>;
            is_potentially_hazardous_asteroid: boolean;
        }>;
    };
}

const formatDateForApi = (date: Date): string => {
    return date.toISOString().split('T')[0];
};
export const fetchNeos = async (date: Date): Promise<NeoObject[]> => {
    const formattedDate = formatDateForApi(date);

    try {
        const response = await axios.get<NeoResponse>(API_URL, {
            params: {
                start_date: formattedDate,
                end_date: formattedDate,
                api_key: API_KEY
            }
        });
        console.log('API Response:', JSON.stringify(response.data, null, 2));
        console.log('Date used:', date);

        return response.data.near_earth_objects[formattedDate].map(neo => ({
            name: neo.name,
            diameter: {
                min: neo.estimated_diameter.feet.estimated_diameter_min,
                max: neo.estimated_diameter.feet.estimated_diameter_max,
                average: (neo.estimated_diameter.feet.estimated_diameter_min + neo.estimated_diameter.feet.estimated_diameter_max) / 2
            },
            velocity: parseFloat(neo.close_approach_data[0].relative_velocity.miles_per_hour),
            missDistance: parseFloat(neo.close_approach_data[0].miss_distance.miles),
            hazardous: neo.is_potentially_hazardous_asteroid
        }));
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};
