import { memo, useCallback } from "react";
import type { ExtNode } from "relatives-tree/lib/types";
import styles from './FamilyNode.module.css'
import classNames from "classnames";
import { HEIGHT, WIDTH } from "./FamilyTree";



interface FamilyNodeProps {
    node: ExtNode;
    isRoot: boolean;
    isHover?: boolean;
    onClick: (id: string) => void;
    onSubClick: (id: string) => void;
    style?: React.CSSProperties;
}

export const FamilyNode = memo(
    ({ node, isRoot, isHover, onClick, onSubClick, style }: FamilyNodeProps) => {
        const clickHandler = useCallback(() => onClick(node.id), [node.id, onClick]);
        const clickSubHandler = useCallback(() => onSubClick(node.id), [node.id, onSubClick]);

        return (
            <div className={styles.root} style={style}>
                <div
                    className={classNames(
                        styles.inner,
                        styles[node.gender],
                        isRoot && styles.isRoot,
                        isHover && styles.isHover,
                    )}
                    onClick={clickHandler}
                >
                    <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/e/e9/Official_portrait_of_Barack_Obama.jpg"
                        className={styles.img}
                        style={{ width: WIDTH, height: HEIGHT }} />
                </div>
                {node.hasSubTree && (
                    <div
                        className={classNames(styles.sub, styles[node.gender])}
                        onClick={clickSubHandler}
                    />
                )}
            </div>
        );
    }
);