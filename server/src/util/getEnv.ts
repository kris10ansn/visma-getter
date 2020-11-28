require("dotenv").config();
const PREFIX = "VISMA";

const getEnv = (name: string) => {
    const env = process.env as { [key: string]: string };
    return env[`${PREFIX}_${name}`];
};

export default getEnv;
