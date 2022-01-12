import DataTable from 'common/ui/datatable';
import Random from 'common/random';
import { Monospace } from 'common/ui/text';

const datatableData = Random.Collection(20, {
  company: Random.Startup,
  name: Random.Name,
  age: Random.Age,
  address: Random.StreetAddress,
  city: Random.City,
  state: Random.State,
  zip: Random.ZipCode,
})();

export default function DataTables () {
  return (
    <div>
      <h2>DataTables <Monospace variant="small">common/ui/datatable</Monospace></h2>

      <DataTable data={datatableData}>
        <DataTable.Cell caption="Company" sortValue="company" width={2} className="left">{(row) => (
          <strong>{row.company}</strong>
        )}</DataTable.Cell>

        <DataTable.Cell caption="Name" sortValue="name" width={2} className="left">{(row) => (
          <strong>{row.name}</strong>
        )}</DataTable.Cell>

        <DataTable.Cell caption="Age" sortValue="age" width="6ch">{(row) => (
          <span>{row.age}</span>
        )}</DataTable.Cell>

        <DataTable.Cell caption="Address" sortValue="address" width={2} className="left">{(row) => (
          <span>{row.address}</span>
        )}</DataTable.Cell>

        <DataTable.Cell caption="City" sortValue="city">{(row) => (
          <span>{row.city}</span>
        )}</DataTable.Cell>

        <DataTable.Cell caption="St" title="State" sortValue="state" width="8ch">{(row) => (
          <abbr title={row.state.long}>{row.state.short}</abbr>
        )}</DataTable.Cell>

        <DataTable.Cell caption="Zip Code" sortValue="zip">{(row) => (
          <span>{row.zip}</span>
        )}</DataTable.Cell>
      </DataTable>
    </div>
  );
}
