import axios from 'axios';

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface NeoObject {
    name: string; // near_earth_objects[date].name
    diameter: {
        average: number;
        min: number;
        max: number;
    }; // TODO !need to avg the min and max in feet! // near_earth_objects[date].estimated_diameter.feet
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
export const fetchNeos = async (date: string = new Date().toISOString().split('T')[0]) : Promise<NeoObject[]> => {
    try {
        const response = await axios.get<NeoResponse>(API_URL, {
            params: {
                start_date: date,
                end_date: date,
                api_key: API_KEY
            }
        });
        return response.data.near_earth_objects[date].map(neo => ({
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
