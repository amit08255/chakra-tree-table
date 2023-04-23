# Chakra Tree Table

Simple tree table built using Chakra UI and ReactJS. It provides high customizability and styling with the support of Chakra UI.

## Getting Started

This is simple standalone component built with Chakra UI and ReactJS. The component can be further customized with styled-components and Chakra UI.

```tsx
import { Box, Button } from '@chakra-ui/react';
import TreeTable, { TreeTableCellProps, TreeTableColumnData, TreeTableRowData } from 'components/TreeTable';
import * as React from 'react';

const TableCell = ({ accessor, data }:TreeTableCellProps) => (
    <Box>{data[accessor]}</Box>
);

const TableIndexCell = ({
    accessor, data, hasChildren, isExpanded, onExpand,
}:TreeTableCellProps) => (
    <Box display="flex">
        {
            hasChildren ? (
                <Button mr="2" onClick={() => onExpand(data.id, !isExpanded)}>
                    {isExpanded ? '-' : '+'}
                </Button>
            ) : null
        }
        {data[accessor]}
    </Box>
);

const DemoPage = () => {
    const data:TreeTableRowData[] = [
        {
            id: 'row-1',
            name: 'Akash',
            className: 'X',
            subject: 'Maths',
            children: [
                {
                    id: 'row-1-1',
                    name: 'Akash',
                    className: 'XI',
                    subject: 'Social Studies',
                    children: [],
                },
            ],
        },
        {
            id: 'row-2',
            name: 'Manish',
            className: 'IX',
            subject: 'Science',
            children: [],
        },
    ];

    const columns:TreeTableColumnData[] = [
        {
            Header: 'Name',
            accessor: 'name',
            Cell: TableIndexCell,
        },
        {
            Header: 'Class Name',
            accessor: 'className',
            Cell: TableCell,
        },
        {
            Header: 'Subject',
            accessor: 'subject',
            Cell: TableCell,
        },
    ];

    return (
        <TreeTable classPrefix="tree-chakra" data={data} columns={columns} />
    );
};

export default DemoPage;
```
