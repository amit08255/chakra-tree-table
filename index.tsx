/* eslint-disable react/jsx-props-no-spreading */
import {
    Box,
    Table, Tbody, Td, Th, Thead, Tr,
} from '@chakra-ui/react';
import * as React from 'react';

export interface TreeTableRowData {
    id: string,
    ChildrenTitle?: React.FC<{data: TreeTableRowData, depth?: number}>,
    [key: string]: any,
}

export interface RowGroupTitle {
    groupKey: string,
    count: number,
    label: string,
    isExpanded: boolean,
    index: number,
}

export interface TreeTableGroupData {
    label: string,
    isExpanded: boolean,
    title: React.FC<RowGroupTitle>,
    data: TreeTableRowData[]
}

export interface GroupedTreeTableRowData {
    [key: string]: TreeTableGroupData,
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
    cellStyles?: {[key:string]: any},
    headerStyles?: {[key:string]: any},
}

export interface TreeTableMarkerProps {
    onExpandAll: () => void,
    onCollapseAll: () => void,
}

export type TreeTableProps = {
    // prefix to class name which allows manipulating Tree table UI by CSS
    classPrefix: string,
    data: TreeTableRowData[]|GroupedTreeTableRowData,
    // List of columns to be displayed in header and node to render for each column
    columns: TreeTableColumnData[],
    // Stores table data with list of child mapped by ID as key
    childMapping: {[key:string]: TreeTableRowData[]},
    // Only used for features like expand/collapse all
    MarkerNode?: React.FC<TreeTableMarkerProps>,
};

export type TreeTableRowProps = {
    classPrefix: string,
    depth: number,
    data: TreeTableRowData[],
    columns: TreeTableColumnData[],
    expanded: {[key:string]: boolean},
    childMapping: {[key:string]: TreeTableRowData[]},
    onExpand: (id: string, value: boolean) => void,
    rootId: string,
    isParentLeaf: boolean,
};

const TableRow = ({
    data, columns, expanded, onExpand, depth, childMapping, classPrefix, rootId,
    isParentLeaf,
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
                        data-isleaf={`${isParentLeaf && rowIndex === data.length - 1 && (expanded[row.id] !== true || (!Array.isArray(childMapping[row.id]) || childMapping[row.id].length < 1))}`}
                        data-haschildren={`${Array.isArray(childMapping[row.id]) && childMapping[row.id].length > 0}`}
                        data-isexpanded={`${expanded[row.id] === true}`}
                        data-rootid={rootId || row.id}
                    >
                        {columns.map((column, index) => {
                            const CellElement = column.Cell;

                            return (
                                <Td
                                    whiteSpace="nowrap"
                                    key={`tbody-row-data${row.id}-${index + 1}`}
                                    data-rowid={row.id}
                                    data-depth={`${depth}`}
                                    data-isleaf={`${isParentLeaf && rowIndex === data.length - 1 && (expanded[row.id] !== true || (Array.isArray(childMapping[row.id]) && childMapping[row.id].length < 1))}`}
                                    data-haschildren={`${Array.isArray(childMapping[row.id]) && childMapping[row.id].length > 0}`}
                                    data-isexpanded={`${expanded[row.id] === true}`}
                                    data-rootid={rootId || row.id}
                                    {...(column.cellStyles || {})}
                                >
                                    <CellElement
                                        data={row}
                                        rowId={row.id}
                                        depth={depth}
                                        isLeaf={
                                            isParentLeaf
                                            && rowIndex === data.length - 1
                                            && (expanded[row.id] !== true
                                                || (Array.isArray(childMapping[row.id])
                                                && childMapping[row.id].length < 1))
                                        }
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
                            <Tr className="static-columns">
                                <Td p="0" m="0" border="none" className="static-columns" colspan={columns.length}>
                                    <Box
                                        className={`${classPrefix}-title`}
                                        data-rowid={row.id}
                                        data-depth={`${depth}`}
                                        data-isleaf={`${(depth === 0 || (isParentLeaf && rowIndex === data.length - 1)) && (!Array.isArray(childMapping[row.id]) || childMapping[row.id].length < 1)}`}
                                        data-haschildren={`${Array.isArray(childMapping[row.id]) && childMapping[row.id].length > 0}`}
                                        data-isexpanded={`${expanded[row.id] === true}`}
                                        data-rootid={rootId || row.id}
                                    >
                                        <TitleNode data={row} depth={depth} />
                                    </Box>
                                </Td>
                            </Tr>
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
                                    rootId={rootId || row.id}
                                    isParentLeaf={
                                        depth === 0
                                            ? true
                                            : isParentLeaf && rowIndex === data.length - 1
                                    }
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
    classPrefix, data, columns, childMapping, MarkerNode,
}:TreeTableProps) => {
    const [expanded, setExpanded] = React.useState<{[key:string]: boolean}>({});

    const isGroupedTableData = React.useCallback(() => {
        const keys = Object.keys(data);
        return (
            keys.length > 0 && data[keys[0]].label
            && data[keys[0]].title && Array.isArray(data[keys[0]].data));
    }, [data]);

    const onExpand = (id:string, val: boolean) => {
        const expandData = { ...expanded };
        expandData[id] = val;
        setExpanded(expandData);
    };

    const onExpandCollapseFirstLevel = (val:boolean) => {
        const expandedVal = { ...expanded };

        Object.keys(childMapping).forEach((key) => {
            expandedVal[key] = val;
        });

        setExpanded(expandedVal);
    };

    const onExpandAll = () => onExpandCollapseFirstLevel(true);

    const onCollapseAll = () => onExpandCollapseFirstLevel(false);

    return (
        <>
            <Table className={`${classPrefix}-table`}>
                <Thead className={`${classPrefix}-head`}>
                    <Tr>
                        {columns.map((column, index) => (
                            <Th whiteSpace="nowrap" scope="col" key={`thead-${index + 1}`} {...(column.headerStyles || {})}>
                                {column.Header}
                            </Th>
                        ))}
                    </Tr>
                </Thead>
                <Tbody className={`${classPrefix}-body`}>
                    {
                        !isGroupedTableData() ? (
                            <TableRow
                                classPrefix={classPrefix}
                                childMapping={childMapping}
                                data={data as TreeTableRowData[]}
                                columns={columns}
                                expanded={expanded}
                                onExpand={onExpand}
                                depth={0}
                                rootId={null}
                                isParentLeaf
                            />
                        ) : null
                    }
                    {
                        isGroupedTableData() ? (
                            Object.keys(data).map((key, index) => {
                                const groupData:TreeTableGroupData = data[key];
                                const GroupTitle = groupData.title;

                                return (
                                    <>
                                        <Tr className="group-title-columns">
                                            <Td p="0" m="0" border="none" className="group-title-columns" colspan={columns.length}>
                                                <GroupTitle
                                                    groupKey={key}
                                                    isExpanded={groupData.isExpanded}
                                                    label={groupData.label}
                                                    count={groupData.data.length}
                                                    index={index}
                                                />
                                            </Td>
                                        </Tr>
                                        {
                                            groupData.isExpanded ? (
                                                <TableRow
                                                    classPrefix={classPrefix}
                                                    childMapping={childMapping}
                                                    data={groupData.data}
                                                    columns={columns}
                                                    expanded={expanded}
                                                    onExpand={onExpand}
                                                    depth={0}
                                                    rootId={null}
                                                    isParentLeaf
                                                />
                                            ) : null
                                        }
                                    </>
                                );
                            })
                        ) : null
                    }
                </Tbody>
            </Table>
            <Box display="none">
                {
                    MarkerNode
                        ? <MarkerNode onExpandAll={onExpandAll} onCollapseAll={onCollapseAll} />
                        : null
                }
            </Box>
        </>
    );
};

TreeTable.defaultProps = {
    MarkerNode: null,
};

export default TreeTable;
