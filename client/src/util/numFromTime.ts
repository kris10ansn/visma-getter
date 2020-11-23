const num = (time: string) => {
    const [hours, minutes] = time.split(":").map((it) => Number(it));
    return hours + minutes / 60;
};
export default num;
