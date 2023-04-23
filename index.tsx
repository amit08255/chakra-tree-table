import {
    Table, Tbody, Td, Th, Thead, Tr,
} from '@chakra-ui/react';
import * as React from 'react';

export interface TreeTableRowData {
    id: string,
    children: TreeTableRowData[],
    [key: string]: any,
}

export interface TreeTableCellProps {
    rowId: string,
    data: TreeTableRowData,
    depth: number,
    isExpanded: boolean,
    hasChildren: boolean,
    isLeaf: boolean,
    totalChildren: number,
    accessor: string,
    onExpand: (id: string, val: boolean) => void,
}

export interface TreeTableColumnData {
    Header: string|React.ReactNode,
    accessor: string,
    Cell: React.FC<TreeTableCellProps>,
  }

export type TreeTableProps = {
    classPrefix: string,
    data: TreeTableRowData[],
    columns: TreeTableColumnData[],
};

export type TreeTableRowProps = {
    depth: number,
    data: TreeTableRowData[],
    columns: TreeTableColumnData[],
    expanded: {[key:string]: boolean},
    onExpand: (id: string, value: boolean) => void,
};

const TableRow = ({
    data, columns, expanded, onExpand, depth,
}:TreeTableRowProps) => (
    <>
        {data.map((row, rowIndex) => (
            <>
                <Tr
                    key={`tbody-row-${row.id}`}
                    data-rowid={row.id}
                    data-depth={`${depth}`}
                    data-isleaf={`${rowIndex === data.length - 1}`}
                    data-haschildren={`${Array.isArray(row.children) && row.children.length > 0}`}
                    data-isexpanded={`${expanded[row.id] === true}`}
                >
                    {columns.map((column, index) => {
                        const CellElement = column.Cell;

                        return (
                            <Td
                                whiteSpace="nowrap"
                                key={`tbody-row-data${row.id}-${index + 1}`}
                                data-rowid={row.id}
                                data-depth={`${depth}`}
                                data-isleaf={`${rowIndex === data.length - 1}`}
                                data-haschildren={`${Array.isArray(row.children) && row.children.length > 0}`}
                                data-isexpanded={`${expanded[row.id] === true}`}
                            >
                                <CellElement
                                    data={row}
                                    rowId={row.id}
                                    depth={depth}
                                    isLeaf={rowIndex === data.length - 1}
                                    hasChildren={
                                        Array.isArray(row.children) && row.children.length > 0
                                    }
                                    isExpanded={expanded[row.id] === true}
                                    totalChildren={
                                        Array.isArray(row.children) ? row.children.length : 0
                                    }
                                    onExpand={onExpand}
                                    accessor={column.accessor}
                                />
                            </Td>
                        );
                    })}
                </Tr>
                {
                    expanded[row.id] === true
                    && Array.isArray(row.children) && row.children.length > 0
                        ? (
                            <TableRow
                                data={row.children}
                                columns={columns}
                                expanded={expanded}
                                onExpand={onExpand}
                                depth={depth + 1}
                            />
                        )
                        : null
                }
            </>
        ))}
    </>
);

const TreeTable = ({
    classPrefix, data, columns,
}:TreeTableProps) => {
    const [expanded, setExpanded] = React.useState<{[key:string]: boolean}>({});

    const onExpand = (id:string, val: boolean) => {
        const expandData = { ...expanded };
        expandData[id] = val;
        setExpanded(expandData);
    };

    return (
        <Table className={`${classPrefix}-table`}>
            <Thead className={`${classPrefix}-head`}>
                <Tr>
                    {columns.map((column, index) => (
                        <Th whiteSpace="nowrap" scope="col" key={`thead-${index + 1}`}>
                            {column.Header}
                        </Th>
                    ))}
                </Tr>
            </Thead>
            <Tbody className={`${classPrefix}-body`}>
                <TableRow
                    data={data}
                    columns={columns}
                    expanded={expanded}
                    onExpand={onExpand}
                    depth={0}
                />
            </Tbody>
        </Table>
    );
};

export default TreeTable;
