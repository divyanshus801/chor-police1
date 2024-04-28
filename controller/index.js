const db = require("../config/db.js");



//NOTE - insert data into city table
const INTSERT_CITYS = async (req, res) => {
    //Inser data into city table
    sql = `INSERT INTO citys(Name,Distance) VALUES (?, ?), (?, ?), (?, ?), (?, ?), (?, ?)`;
    db.run(sql, ["Yapkashnagar", "60km", "Lihaspur", "50km", "Narmis City", "40km", "Shekharvati", "30km", "Nuravgram", "20km",],
        (err) => {
            if (err) return console.error(err.message);
        }
    );
    return res.send("Data added successfully");
}

//NOTE - get data from city table
const CITY_SELECTION = async (req, res) => {
    try {
        const final = await new Promise((resolve, reject) => {
            db.all("SELECT * FROM citys", [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
        return res.status(200).send(final);
    } catch (err) {
        console.error(err.message);
    }
}



//NOTE - Update citys table data
const UPDATE_CITY = async (req, res) => {
    const { ID, NAME, DISTANCE } = req.body;
    if (!ID || !NAME || !DISTANCE) {
        return res.status(400).send("ID, NAME, and DISTANCE are required.");
    }
    try {
        const sql = `UPDATE citys SET Name = ?, Distance = ? WHERE ID = ?`;
        db.run(sql, [NAME, DISTANCE, ID], function (err) {
            if (err) {
                console.error(err.message);
                return res.status(500).send("Failed to update city.");
            }
            return res.status(200).send(`City with ID ${ID} updated successfully.`);
        });
    } catch (err) {
        return res.status(500).send("Internal Server Error");
    }
};



//NOTE - insert data into vehicle table
const INTSERT_VEHICLE = async (req, res) => {
    //Inser data into city table
    sql = `INSERT INTO Vehicle(Kind,Range,Count) VALUES (?, ?,?), (?, ?,?), (?, ?,?)`;
    db.run(sql, ["EV Bike", "60km", 2, "EV Car", "100km", 1, "EV SUV", "120km", 1],
        (err) => {
            if (err) return console.error(err.message);
        }
    );
    return res.send("Data added successfully");
}



//NOTE - get data from VEHICLE table
const VEHICLE_SELECTION = async (req, res) => {
    try {
        const VEHICLES = await new Promise((resolve, reject) => {
            db.all("SELECT * FROM Vehicle", [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
        return res.status(200).send(VEHICLES);
    } catch (err) {
        console.error(err.message);
    }
}



//NOTE - Update VEHICLE table data
const UPDATE_VEHICLE = async (req, res) => {
    const { Id, Kind, Range, Count } = req.body;
    if (!Id || !Kind || !Range || !Count) {
        return res.status(400).send("ID, Kind, Range, and Count are required.");
    }
    try {
        const sql = `UPDATE Vehicle SET Kind = ?, Range = ?, Count = ? WHERE id = ?`;
        db.run(sql, [Kind, Range, Count, Id], function (err) {
            if (err) {
                console.error(err.message);
                return res.status(500).send("Failed to update Vehicles.");
            }
            return res.status(200).send(`Vehicle with ID ${Id} updated successfully.`);
        });
    } catch (err) {
        return res.status(500).send("Internal Server Error");
    }
};


//NOTE - capture fugitive
const CAPTURE_FUGITIVE = async (req, res) => {
    try {

        //NOTE - Get the cop's city selection and vehicle selection from the request body
        const { copCity, copVehicle } = req.body;

        //NOTE - Retrieve the list of cities from the database
        const cities = await getCities();

        //NOTE - cop table
        const cop = await cops();

        //NOTE - range of cop Vehicle
        const range = await getVehicleRangeByKind(copVehicle);

        //NOTE - Simulate the fugitive's location by randomly selecting a city from the list of cities
        const fugitiveLocation = selectRandomCity(cities);

        //NOTE - serching fugitive
        const captureResult = determineCaptureResult(copCity, range.Range, fugitiveLocation);

        //NOTE - serched cop's
        const copsName = selectCops(cop);

        //NOTE - If a cop successfully captures the fugitive
        if (captureResult) {
            return res.status(200).json({
                success: true,
                copName: copsName.Name,
                message: 'Cop successfully captured the fugitive!'
            });
        } else {
            //NOTE - If no cop successfully captures the fugitive
            return res.status(200).json({
                success: false,
                message: "Not captured"
            });
        }
    } catch (err) {
        return res.status(500).send("Internal Server Error");
    }
}


//NOTE - Function to retrieve cities from the database
const getCities = async () => {
    try {
        return await new Promise((resolve, reject) => {
            db.all("SELECT * FROM citys", [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    } catch (err) {
        throw err;
    }
};


const cops = async () => {
    try {
        return await new Promise((resolve, reject) => {
            db.all("SELECT * FROM Cops", [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    } catch (err) {
        throw err;
    }
};


// Function to retrieve the range of a vehicle based on its kind
const getVehicleRangeByKind = async (kind) => {
    try {
        return await new Promise((resolve, reject) => {
            db.get("SELECT Range FROM Vehicle WHERE Kind = ?", [kind], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    } catch (err) {
        throw err;
    }
};


//NOTE - Function to randomly select a city from the list of cities
const selectRandomCity = (cities) => {
    const randomIndex = Math.floor(Math.random() * cities.length);
    return cities[randomIndex];
};


//NOTE - Function to select cops
const selectCops = (cops) => {
    const randomIndex = Math.floor(Math.random() * cops.length);
    return cops[randomIndex];
};

//NOTE - Function to determine if any cop successfully captured the fugitive
const determineCaptureResult = (copCity, copVehicle, fugitiveLocation) => {
    // Check if the cop's city selection matches the fugitive's location
    if (copCity === fugitiveLocation.Name) {

        //NOTE - cop's range
        const copVehicleRange = getCopVehicleRange(copVehicle);

        //NOTE - fugitive Location
        const distanceToCapture = parseFloat(fugitiveLocation.Distance.replace('km', ''));

        if (copVehicleRange >= distanceToCapture) {
            // If the cop's vehicle has enough range, return the cop's name
            return true;
        }
    }

    // If no cop successfully captured the fugitive, return "Not captured"
    return false;
};

//NOTE - Function to get the range of the cop's selected vehicle
const getCopVehicleRange = (copVehicle) => {
    return parseInt(copVehicle.match(/\d+/)[0]);
};


//NOTE - exports functions
module.exports = {
    INTSERT_CITYS,
    CITY_SELECTION,
    UPDATE_CITY,
    INTSERT_VEHICLE,
    VEHICLE_SELECTION,
    UPDATE_VEHICLE,
    CAPTURE_FUGITIVE
}