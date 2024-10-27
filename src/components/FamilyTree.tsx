
// import { useState } from 'react'

import calcTree from 'relatives-tree'; 
import ReactFamilyTree from 'react-family-tree';
import { FamilyNode } from './FamilyNode';
import styles from './FamilyTree.module.css'

export const WIDTH = 120;
export const HEIGHT = 150;


export default function FamilyTree({ json, rootId }: { json: any[], rootId: string }) {

    // get all IDs and their relationships
    // lazy load profile info for each user as you expand

    const tree = calcTree(json, { rootId });
    console.log(tree);


    return (
        <div className={styles.root}>
            <div className={styles.wrapper}>
                <ReactFamilyTree
                    nodes={json}
                    rootId={rootId}
                    width={WIDTH}
                    height={HEIGHT}
                    className={styles.tree}
                    renderNode={(node) => (
                        <FamilyNode
                            isRoot={node.id == rootId}
                            key={node.id}
                            node={node}
                            style={{
                                width: WIDTH,
                                height: HEIGHT,
                                transform: `translate(${node.left * (WIDTH / 2)}px, ${node.top * (HEIGHT / 2)}px)`,
                            }}
                            onClick={() => null}
                            onSubClick={() => null}
                        />
                    )}
                />
            </div>
        </div>
    )
}
