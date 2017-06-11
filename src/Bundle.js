/* @flow */
import type {BundleInterface} from "solfegejs/interface"

/**
 * Server router bundle
 */
export default class Bundle implements BundleInterface
{
    /**
     * Constructor
     */
    constructor():void
    {
    }

    /**
     * Get bundle path
     *
     * @return  {String}        The bundle path
     */
    getPath():string
    {
        return __dirname;
    }
}
