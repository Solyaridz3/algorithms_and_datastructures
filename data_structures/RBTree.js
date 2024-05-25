class Node {
    constructor(
        value,
        color = "RED",
        left = null,
        right = null,
        parent = null
    ) {
        this.value = value;
        this.color = color;
        this.left = left;
        this.right = right;
        this.parent = parent;
    }
}

class RedBlackTree {
    constructor() {
        this.NULL_NODE = new Node(null, "BLACK"); // null node for black leaves
        this.root = this.NULL_NODE;
    }

    search(value) {
        return this.searchTreeHelper(this.root, value);
    }

    searchTreeHelper(node, value) {
        if (node === this.NULL_NODE || value === node.value) {
            return node;
        }

        if (value < node.value) {
            return this.searchTreeHelper(node.left, value);
        }
        return this.searchTreeHelper(node.right, value);
    }

    insert(value) {
        const newNode = new Node(value);
        newNode.left = this.NULL_NODE;
        newNode.right = this.NULL_NODE;
        newNode.color = "RED";

        let parentNode = null;
        let currentNode = this.root;

        // Traverse the tree to find the appropriate place for the new node
        while (currentNode !== this.NULL_NODE) {
            parentNode = currentNode;
            if (newNode.value < currentNode.value) {
                currentNode = currentNode.left;
            } else {
                currentNode = currentNode.right;
            }
        }

        newNode.parent = parentNode;
        if (parentNode === null) {
            this.root = newNode;
        } else if (newNode.value < parentNode.value) {
            parentNode.left = newNode;
        } else {
            parentNode.right = newNode;
        }

        // Fix Red-Black Tree properties
        if (newNode.parent === null) {
            newNode.color = "BLACK";
            return;
        }

        // For the the grandkids of root
        if (newNode.parent.parent === null) {
            return;
        }

        this.fixInsert(newNode);
    }

    fixInsert(node) {
        while (node.parent.color === "RED") {
            // if parent is a right child of grandpa
            if (node.parent === node.parent.parent.right) {
                let uncleNode = node.parent.parent.left;
                if (uncleNode.color === "RED") {
                    uncleNode.color = "BLACK";
                    node.parent.color = "BLACK";
                    node.parent.parent.color = "RED";
                    node = node.parent.parent;
                } else {
                    if (node === node.parent.left) {
                        node = node.parent;
                        this.rightRotate(node);
                    }
                    node.parent.color = "BLACK";
                    node.parent.parent.color = "RED";
                    this.leftRotate(node.parent.parent);
                }
            } else {
                let uncleNode = node.parent.parent.right;
                if (uncleNode.color === "RED") {
                    uncleNode.color = "BLACK";
                    node.parent.color = "BLACK";
                    node.parent.parent.color = "RED";
                    node = node.parent.parent;
                } else {
                    if (node === node.parent.right) {
                        node = node.parent;
                        this.leftRotate(node);
                    }
                    node.parent.color = "BLACK";
                    node.parent.parent.color = "RED";
                    this.rightRotate(node.parent.parent);
                }
            }
            if (node === this.root) {
                break;
            }
        }
        this.root.color = "BLACK";
    }

    leftRotate(node) {
        const rightChild = node.right;
        node.right = rightChild.left;
        if (rightChild.left !== this.NULL_NODE) {
            rightChild.left.parent = node;
        }
        rightChild.parent = node.parent;
        if (node.parent === null) {
            this.root = rightChild;
        } else if (node === node.parent.left) {
            node.parent.left = rightChild;
        } else {
            node.parent.right = rightChild;
        }
        rightChild.left = node;
        node.parent = rightChild;
    }

    rightRotate(node) {
        const leftChild = node.left;
        node.left = leftChild.right;
        if (leftChild.right !== this.NULL_NODE) {
            leftChild.right.parent = node;
        }
        leftChild.parent = node.parent;
        if (node.parent === null) {
            this.root = leftChild;
        } else if (node === node.parent.right) {
            node.parent.right = leftChild;
        } else {
            node.parent.left = leftChild;
        }
        leftChild.right = node;
        node.parent = leftChild;
    }

    deleteNode(value) {
        this.deleteNodeHelper(this.root, value);
    }

    deleteNodeHelper(node, value) {
        let nodeToDelete = this.NULL_NODE;
        let replacementNode, childNode;

        // Find the node to delete
        while (node !== this.NULL_NODE) {
            if (node.value === value) {
                nodeToDelete = node;
            }
            if (node.value <= value) {
                node = node.right;
            } else {
                node = node.left;
            }
        }

        if (nodeToDelete === this.NULL_NODE) {
            console.log("Couldn't find value in the tree");
            return;
        }

        let originalColor = nodeToDelete.color;
        if (nodeToDelete.left === this.NULL_NODE) {
            childNode = nodeToDelete.right;
            this.rbTransplant(nodeToDelete, nodeToDelete.right);
        } else if (nodeToDelete.right === this.NULL_NODE) {
            childNode = nodeToDelete.left;
            this.rbTransplant(nodeToDelete, nodeToDelete.left);
        } else {
            replacementNode = this.minimum(nodeToDelete.right);
            originalColor = replacementNode.color;
            childNode = replacementNode.right;
            if (replacementNode.parent === nodeToDelete) {
                childNode.parent = replacementNode;
            } else {
                this.rbTransplant(replacementNode, replacementNode.right);
                replacementNode.right = nodeToDelete.right;
                replacementNode.right.parent = replacementNode;
            }

            this.rbTransplant(nodeToDelete, replacementNode);
            replacementNode.left = nodeToDelete.left;
            replacementNode.left.parent = replacementNode;
            replacementNode.color = nodeToDelete.color;
        }
        if (originalColor === "BLACK") {
            this.fixDelete(childNode);
        }
    }

    fixDelete(node) {
        while (node !== this.root && node.color === "BLACK") {
            if (node === node.parent.left) {
                let sibling = node.parent.right;
                if (sibling.color === "RED") {
                    sibling.color = "BLACK";
                    node.parent.color = "RED";
                    this.leftRotate(node.parent);
                    sibling = node.parent.right;
                }

                if (
                    sibling.left.color === "BLACK" &&
                    sibling.right.color === "BLACK"
                ) {
                    sibling.color = "RED";
                    node = node.parent;
                } else {
                    if (sibling.right.color === "BLACK") {
                        sibling.left.color = "BLACK";
                        sibling.color = "RED";
                        this.rightRotate(sibling);
                        sibling = node.parent.right;
                    }

                    sibling.color = node.parent.color;
                    node.parent.color = "BLACK";
                    sibling.right.color = "BLACK";
                    this.leftRotate(node.parent);
                    node = this.root;
                }
            } else {
                let sibling = node.parent.left;
                if (sibling.color === "RED") {
                    sibling.color = "BLACK";
                    node.parent.color = "RED";
                    this.rightRotate(node.parent);
                    sibling = node.parent.left;
                }

                if (
                    sibling.right.color === "BLACK" &&
                    sibling.left.color === "BLACK"
                ) {
                    sibling.color = "RED";
                    node = node.parent;
                } else {
                    if (sibling.left.color === "BLACK") {
                        sibling.right.color = "BLACK";
                        sibling.color = "RED";
                        this.leftRotate(sibling);
                        sibling = node.parent.left;
                    }

                    sibling.color = node.parent.color;
                    node.parent.color = "BLACK";
                    sibling.left.color = "BLACK";
                    this.rightRotate(node.parent);
                    node = this.root;
                }
            }
        }
        node.color = "BLACK";
    }

    rbTransplant(targetNode, withNode) {
        if (targetNode.parent === null) {
            this.root = withNode;
        } else if (targetNode === targetNode.parent.left) {
            targetNode.parent.left = withNode;
        } else {
            targetNode.parent.right = withNode;
        }
        withNode.parent = targetNode.parent;
    }

    minimum(node) {
        while (node.left !== this.NULL_NODE) {
            node = node.left;
        }
        return node;
    }
}

// Example usage:
let rbt = new RedBlackTree();
rbt.insert(20);
rbt.insert(15);
rbt.insert(25);
rbt.insert(10);
rbt.insert(5);
rbt.insert(1);

console.log(rbt.search(25)); // Node with value 25
console.log(rbt.search(30)); // NIL node, not found

rbt.deleteNode(15);

console.log(rbt.search(15)); // NIL node, not found
