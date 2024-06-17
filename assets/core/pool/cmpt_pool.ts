import { Component, Node } from "cc";
import { ObjPool } from "./obj_pool";

/**
 * 組件池物件
 */
export interface CmptPoolObj {
    /**
     * 取出
     */
    reuse(): void;

    /**
     * 回收
     */
    unuse(): void;
}

/**
 * 組件池
 */
export class CmptPool extends ObjPool<Component, Node> {
    // 名稱
    public get name(): string { return this.constructor.name; }

    /**
     * 取得物件
     * @param key 
     */
    public get(key: Component): Node {
        return this.getCmpt(key).node;
    }

    /**
     * 取得物件
     * @param key 
     */
    public getObj(key: Component): Node {
        return this.getCmpt(key).node;
    }

    /**
     * 取得組件
     * @param key 
     */
    public getCmpt<T extends Component>(key: Component): T {
        let value = super.get(key);

        let cmpt: any = value?.getComponent(key.name);
        cmpt && cmpt.reuse && cmpt.reuse();

        return <T>cmpt;
    }

    /**
     * 回收
     * @param key 
     * @param value 
     */
    public put(key: Component, value: Node): boolean {
        let cmpt: any = value.getComponent(key.name);
        cmpt && cmpt.unuse && cmpt.unuse();

        return super.put(key, value);
    }
}
