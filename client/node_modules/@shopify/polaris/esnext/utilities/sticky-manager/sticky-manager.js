import debounce from 'lodash/debounce';
import { getRectForNode } from '@shopify/javascript-utilities/geometry';
import { addEventListener, removeEventListener, } from '@shopify/javascript-utilities/events';
import tokens from '@shopify/polaris-tokens';
import { dataPolarisTopBar, scrollable } from '../../components/shared';
import { stackedContent } from '../breakpoints';
export class StickyManager {
    constructor(container) {
        this.stickyItems = [];
        this.stuckItems = [];
        this.container = null;
        this.topBarOffset = 0;
        this.handleResize = debounce(() => {
            this.manageStickyItems();
        }, 40, { leading: true, trailing: true, maxWait: 40 });
        this.handleScroll = debounce(() => {
            this.manageStickyItems();
        }, 40, { leading: true, trailing: true, maxWait: 40 });
        if (container) {
            this.setContainer(container);
        }
    }
    registerStickyItem(stickyItem) {
        this.stickyItems.push(stickyItem);
    }
    unregisterStickyItem(nodeToRemove) {
        const nodeIndex = this.stickyItems.findIndex(({ stickyNode }) => nodeToRemove === stickyNode);
        this.stickyItems.splice(nodeIndex, 1);
    }
    setContainer(el) {
        this.container = el;
        if (isDocument(el)) {
            this.setTopBarOffset(el);
        }
        addEventListener(this.container, 'scroll', this.handleScroll);
        addEventListener(window, 'resize', this.handleResize);
        this.manageStickyItems();
    }
    removeScrollListener() {
        if (this.container) {
            removeEventListener(this.container, 'scroll', this.handleScroll);
            removeEventListener(window, 'resize', this.handleResize);
        }
    }
    manageStickyItems() {
        if (this.stickyItems.length <= 0) {
            return;
        }
        const scrollTop = this.container ? scrollTopFor(this.container) : 0;
        const containerTop = getRectForNode(this.container).top + this.topBarOffset;
        this.stickyItems.forEach((stickyItem) => {
            const { handlePositioning } = stickyItem;
            const { sticky, top, left, width } = this.evaluateStickyItem(stickyItem, scrollTop, containerTop);
            this.updateStuckItems(stickyItem, sticky);
            handlePositioning(sticky, top, left, width);
        });
    }
    evaluateStickyItem(stickyItem, scrollTop, containerTop) {
        const { stickyNode, placeHolderNode, boundingElement, offset, disableWhenStacked, } = stickyItem;
        if (disableWhenStacked && stackedContent().matches) {
            return {
                sticky: false,
                top: 0,
                left: 0,
                width: 'auto',
            };
        }
        const stickyOffset = offset
            ? this.getOffset(stickyNode) + parseInt(tokens.spacingLoose, 10)
            : this.getOffset(stickyNode);
        const scrollPosition = scrollTop + stickyOffset;
        const placeHolderNodeCurrentTop = placeHolderNode.getBoundingClientRect().top - containerTop + scrollTop;
        const top = containerTop + stickyOffset;
        const width = placeHolderNode.getBoundingClientRect().width;
        const left = placeHolderNode.getBoundingClientRect().left;
        let sticky;
        if (boundingElement == null) {
            sticky = scrollPosition >= placeHolderNodeCurrentTop;
        }
        else {
            const stickyItemHeight = stickyNode.getBoundingClientRect().height;
            const stickyItemBottomPosition = boundingElement.getBoundingClientRect().bottom -
                stickyItemHeight +
                scrollTop -
                containerTop;
            sticky =
                scrollPosition >= placeHolderNodeCurrentTop &&
                    scrollPosition < stickyItemBottomPosition;
        }
        return {
            sticky,
            top,
            left,
            width,
        };
    }
    updateStuckItems(item, sticky) {
        const { stickyNode } = item;
        if (sticky && !this.isNodeStuck(stickyNode)) {
            this.addStuckItem(item);
        }
        else if (!sticky && this.isNodeStuck(stickyNode)) {
            this.removeStuckItem(item);
        }
    }
    addStuckItem(stickyItem) {
        this.stuckItems.push(stickyItem);
    }
    removeStuckItem(stickyItem) {
        const { stickyNode: nodeToRemove } = stickyItem;
        const nodeIndex = this.stuckItems.findIndex(({ stickyNode }) => nodeToRemove === stickyNode);
        this.stuckItems.splice(nodeIndex, 1);
    }
    getOffset(node) {
        if (this.stuckItems.length === 0) {
            return 0;
        }
        let offset = 0;
        let count = 0;
        const stuckNodesLength = this.stuckItems.length;
        const nodeRect = getRectForNode(node);
        while (count < stuckNodesLength) {
            const stuckNode = this.stuckItems[count].stickyNode;
            if (stuckNode !== node) {
                const stuckNodeRect = getRectForNode(stuckNode);
                if (!horizontallyOverlaps(nodeRect, stuckNodeRect)) {
                    offset += getRectForNode(stuckNode).height;
                }
            }
            else {
                break;
            }
            count++;
        }
        return offset;
    }
    isNodeStuck(node) {
        const nodeFound = this.stuckItems.findIndex(({ stickyNode }) => node === stickyNode);
        return nodeFound >= 0;
    }
    setTopBarOffset(container) {
        const topbarElement = container.querySelector(`:not(${scrollable.selector}) ${dataPolarisTopBar.selector}`);
        this.topBarOffset = topbarElement ? topbarElement.clientHeight : 0;
    }
}
function isDocument(node) {
    return node === document;
}
function scrollTopFor(container) {
    return isDocument(container)
        ? document.body.scrollTop || document.documentElement.scrollTop
        : container.scrollTop;
}
function horizontallyOverlaps(rect1, rect2) {
    const rect1Left = rect1.left;
    const rect1Right = rect1.left + rect1.width;
    const rect2Left = rect2.left;
    const rect2Right = rect2.left + rect2.width;
    return rect2Right < rect1Left || rect1Right < rect2Left;
}
