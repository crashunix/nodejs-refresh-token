export default (title: string) => {
    return title.toLowerCase().replace(/ /g, '-');
}