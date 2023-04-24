import {
    Box,
    Table, Tbody, Td, Th, Thead, Tr,
} from '@chakra-ui/react';
import * as React from 'react';

export interface TreeTableRowData {
    id: string,
    ChildrenTitle?: React.FC<{data: TreeTableRowData}>,
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
    childMapping: {[key:string]: TreeTableRowData[]},
};

export type TreeTableRowProps = {
    classPrefix: string,
    depth: number,
    data: TreeTableRowData[],
    columns: TreeTableColumnData[],
    expanded: {[key:string]: boolean},
    childMapping: {[key:string]: TreeTableRowData[]},
    onExpand: (id: string, value: boolean) => void,
};

const TableRow = ({
    data, columns, expanded, onExpand, depth, childMapping, classPrefix,
}:TreeTableRowProps) => (
    <>
        {data.map((row, rowIndex) => {
            const TitleNode = row.ChildrenTitle;

            return (
                <>
                    <Tr
                        key={`tbody-row-${row.id}`}
                        data-rowid={row.id}
                        data-depth={`${depth}`}
                        data-isleaf={`${rowIndex === data.length - 1}`}
                        data-haschildren={`${Array.isArray(childMapping[row.id]) && childMapping[row.id].length > 0}`}
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
                                    data-haschildren={`${Array.isArray(childMapping[row.id]) && childMapping[row.id].length > 0}`}
                                    data-isexpanded={`${expanded[row.id] === true}`}
                                >
                                    <CellElement
                                        data={row}
                                        rowId={row.id}
                                        depth={depth}
                                        isLeaf={rowIndex === data.length - 1}
                                        hasChildren={
                                            Array.isArray(childMapping[row.id])
                                            && childMapping[row.id].length > 0
                                        }
                                        isExpanded={expanded[row.id] === true}
                                        totalChildren={
                                            Array.isArray(childMapping[row.id])
                                                ? childMapping[row.id].length : 0
                                        }
                                        onExpand={onExpand}
                                        accessor={column.accessor}
                                    />
                                </Td>
                            );
                        })}
                    </Tr>
                    {
                        expanded[row.id] === true && TitleNode ? (
                            <Box
                                className={`${classPrefix}-title`}
                                display="table-row"
                                data-rowid={row.id}
                                data-depth={`${depth}`}
                                data-isleaf={`${rowIndex === data.length - 1}`}
                                data-haschildren={`${Array.isArray(childMapping[row.id]) && childMapping[row.id].length > 0}`}
                                data-isexpanded={`${expanded[row.id] === true}`}
                            >
                                <TitleNode data={row} />
                            </Box>
                        ) : null
                    }
                    {
                        expanded[row.id] === true
                        && Array.isArray(childMapping[row.id]) && childMapping[row.id].length > 0
                            ? (
                                <TableRow
                                    classPrefix={classPrefix}
                                    childMapping={childMapping}
                                    data={childMapping[row.id]}
                                    columns={columns}
                                    expanded={expanded}
                                    onExpand={onExpand}
                                    depth={depth + 1}
                                />
                            )
                            : null
                    }
                </>
            );
        })}
    </>
);

const TreeTable = ({
    classPrefix, data, columns, childMapping,
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
                    classPrefix={classPrefix}
                    childMapping={childMapping}
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
