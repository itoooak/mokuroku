type ID = string;
interface BookData {
  title: string,
}

type Index = Map<ID, BookData>;

type UpSertRequest = {
  id: ID,
  data: BookData,
};
type DeleteRequest = {
  id: ID,
}
