import React from 'react';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import { classNames } from '../../utilities/css';
import { headerCell } from '../shared';
import { withAppProvider, } from '../../utilities/with-app-provider';
import { EventListener } from '../EventListener';
import { Cell, Navigation } from './components';
import { measureColumn, getPrevAndCurrentColumns } from './utilities';
import styles from './DataTable.scss';
class DataTableInner extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            condensed: false,
            columnVisibilityData: [],
            isScrolledFarthestLeft: true,
            isScrolledFarthestRight: false,
        };
        this.dataTable = React.createRef();
        this.scrollContainer = React.createRef();
        this.table = React.createRef();
        this.handleResize = debounce(() => {
            const { table: { current: table }, scrollContainer: { current: scrollContainer }, } = this;
            let condensed = false;
            if (table && scrollContainer) {
                condensed = table.scrollWidth > scrollContainer.clientWidth;
            }
            this.setState(Object.assign({ condensed }, this.calculateColumnVisibilityData(condensed)));
        });
        this.calculateColumnVisibilityData = (condensed) => {
            const { table: { current: table }, scrollContainer: { current: scrollContainer }, dataTable: { current: dataTable }, } = this;
            if (condensed && table && scrollContainer && dataTable) {
                const headerCells = table.querySelectorAll(headerCell.selector);
                if (headerCells.length > 0) {
                    const firstVisibleColumnIndex = headerCells.length - 1;
                    const tableLeftVisibleEdge = scrollContainer.scrollLeft;
                    const tableRightVisibleEdge = scrollContainer.scrollLeft + dataTable.offsetWidth;
                    const tableData = {
                        firstVisibleColumnIndex,
                        tableLeftVisibleEdge,
                        tableRightVisibleEdge,
                    };
                    const columnVisibilityData = [...headerCells].map(measureColumn(tableData));
                    const lastColumn = columnVisibilityData[columnVisibilityData.length - 1];
                    return Object.assign(Object.assign({ columnVisibilityData }, getPrevAndCurrentColumns(tableData, columnVisibilityData)), { isScrolledFarthestLeft: tableLeftVisibleEdge === 0, isScrolledFarthestRight: lastColumn.rightEdge <= tableRightVisibleEdge });
                }
            }
            return {
                columnVisibilityData: [],
                previousColumn: undefined,
                currentColumn: undefined,
            };
        };
        this.scrollListener = () => {
            this.setState((prevState) => (Object.assign({}, this.calculateColumnVisibilityData(prevState.condensed))));
        };
        this.navigateTable = (direction) => {
            const { currentColumn, previousColumn } = this.state;
            const { current: scrollContainer } = this.scrollContainer;
            const handleScroll = () => {
                if (!currentColumn || !previousColumn) {
                    return;
                }
                if (scrollContainer) {
                    scrollContainer.scrollLeft =
                        direction === 'right'
                            ? currentColumn.rightEdge
                            : previousColumn.leftEdge;
                    requestAnimationFrame(() => {
                        this.setState((prevState) => (Object.assign({}, this.calculateColumnVisibilityData(prevState.condensed))));
                    });
                }
            };
            return handleScroll;
        };
        this.renderHeadings = (heading, headingIndex) => {
            const { sortable, truncate = false, columnContentTypes, defaultSortDirection, initialSortColumnIndex = 0, verticalAlign, } = this.props;
            const { sortDirection = defaultSortDirection, sortedColumnIndex = initialSortColumnIndex, } = this.state;
            let sortableHeadingProps;
            const id = `heading-cell-${headingIndex}`;
            if (sortable) {
                const isSortable = sortable[headingIndex];
                const isSorted = isSortable && sortedColumnIndex === headingIndex;
                const direction = isSorted ? sortDirection : 'none';
                sortableHeadingProps = {
                    defaultSortDirection,
                    sorted: isSorted,
                    sortable: isSortable,
                    sortDirection: direction,
                    onSort: this.defaultOnSort(headingIndex),
                };
            }
            return (<Cell header key={id} content={heading} contentType={columnContentTypes[headingIndex]} firstColumn={headingIndex === 0} truncate={truncate} {...sortableHeadingProps} verticalAlign={verticalAlign}/>);
        };
        this.totalsRowHeading = () => {
            const { polaris: { intl }, totals, totalsName, } = this.props;
            const totalsLabel = totalsName
                ? totalsName
                : {
                    singular: intl.translate('Polaris.DataTable.totalRowHeading'),
                    plural: intl.translate('Polaris.DataTable.totalsRowHeading'),
                };
            return totals && totals.filter((total) => total !== '').length > 1
                ? totalsLabel.plural
                : totalsLabel.singular;
        };
        this.renderTotals = (total, index) => {
            const id = `totals-cell-${index}`;
            const { truncate = false, verticalAlign } = this.props;
            let content;
            let contentType;
            if (index === 0) {
                content = this.totalsRowHeading();
            }
            if (total !== '' && index > 0) {
                contentType = 'numeric';
                content = total;
            }
            const totalInFooter = this.props.showTotalsInFooter;
            return (<Cell total totalInFooter={totalInFooter} firstColumn={index === 0} key={id} content={content} contentType={contentType} truncate={truncate} verticalAlign={verticalAlign}/>);
        };
        this.defaultRenderRow = (row, index) => {
            const className = classNames(styles.TableRow);
            const { columnContentTypes, truncate = false, verticalAlign } = this.props;
            return (<tr key={`row-${index}`} className={className}>
        {row.map((content, cellIndex) => {
                const id = `cell-${cellIndex}-row-${index}`;
                return (<Cell key={id} content={content} contentType={columnContentTypes[cellIndex]} firstColumn={cellIndex === 0} truncate={truncate} verticalAlign={verticalAlign}/>);
            })}
      </tr>);
        };
        this.defaultOnSort = (headingIndex) => {
            const { onSort, defaultSortDirection = 'ascending', initialSortColumnIndex, } = this.props;
            const { sortDirection = defaultSortDirection, sortedColumnIndex = initialSortColumnIndex, } = this.state;
            let newSortDirection = defaultSortDirection;
            if (sortedColumnIndex === headingIndex) {
                newSortDirection =
                    sortDirection === 'ascending' ? 'descending' : 'ascending';
            }
            const handleSort = () => {
                this.setState({
                    sortDirection: newSortDirection,
                    sortedColumnIndex: headingIndex,
                }, () => {
                    if (onSort) {
                        onSort(headingIndex, newSortDirection);
                    }
                });
            };
            return handleSort;
        };
    }
    componentDidMount() {
        // We need to defer the calculation in development so the styles have time to be injected.
        if (process.env.NODE_ENV === 'development') {
            setTimeout(() => {
                this.handleResize();
            }, 10);
        }
        else {
            this.handleResize();
        }
    }
    componentDidUpdate(prevProps) {
        if (isEqual(prevProps, this.props)) {
            return;
        }
        this.handleResize();
    }
    render() {
        const { headings, totals, showTotalsInFooter, rows, footerContent, hideScrollIndicator = false, } = this.props;
        const { condensed, columnVisibilityData, isScrolledFarthestLeft, isScrolledFarthestRight, } = this.state;
        const className = classNames(styles.DataTable, condensed && styles.condensed);
        const wrapperClassName = classNames(styles.TableWrapper, condensed && styles.condensed);
        const headingMarkup = <tr>{headings.map(this.renderHeadings)}</tr>;
        const totalsMarkup = totals ? (<tr>{totals.map(this.renderTotals)}</tr>) : null;
        const bodyMarkup = rows.map(this.defaultRenderRow);
        const footerMarkup = footerContent ? (<div className={styles.Footer}>{footerContent}</div>) : null;
        const headerTotalsMarkup = !showTotalsInFooter ? totalsMarkup : null;
        const footerTotalsMarkup = showTotalsInFooter ? (<tfoot>{totalsMarkup}</tfoot>) : null;
        const navigationMarkup = hideScrollIndicator ? null : (<Navigation columnVisibilityData={columnVisibilityData} isScrolledFarthestLeft={isScrolledFarthestLeft} isScrolledFarthestRight={isScrolledFarthestRight} navigateTableLeft={this.navigateTable('left')} navigateTableRight={this.navigateTable('right')}/>);
        return (<div className={wrapperClassName}>
        {navigationMarkup}
        <div className={className} ref={this.dataTable}>
          <div className={styles.ScrollContainer} ref={this.scrollContainer}>
            <EventListener event="resize" handler={this.handleResize}/>
            <EventListener capture event="scroll" handler={this.scrollListener}/>
            <table className={styles.Table} ref={this.table}>
              <thead>
                {headingMarkup}
                {headerTotalsMarkup}
              </thead>
              <tbody>{bodyMarkup}</tbody>
              {footerTotalsMarkup}
            </table>
          </div>
          {footerMarkup}
        </div>
      </div>);
    }
}
export const DataTable = withAppProvider()(DataTableInner);
