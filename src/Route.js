/* @flow */

/**
 * Route definition
 */
export default class Route
{
    /**
     * Route identifier
     */
    id:string;

    /**
     * Controller ID
     */
    controllerId:string;

    /**
     * Controller instance
     */
    controller:*;

    /**
     * Action name
     */
    actionName:string;

    /**
     * Path
     */
    path:string;

    /**
     * Methods
     */
    methods:Array<string>;

    /**
     * URL matcher ID
     */
    urlMatcherId:string;

    /**
     * Constructor
     */
    constructor()
    {
        // Initialize properties
        this.methods = [];
        this.urlMatcherId = "standard";
    }

    /**
     * Get identifier
     *
     * @return  {string}    Identifier
     */
    getId()
    {
        return this.id;
    }

    /**
     * Set identifier
     *
     * @param   {string}    id      Identifier
     */
    setId(id:string)
    {
        this.id = id;
    }

    /**
     * Get controller id
     *
     * @return  {string}    controller id
     */
    getControllerId()
    {
        return this.controllerId;
    }

    /**
     * Set controller id
     *
     * @param   {string}    id      Controller id
     */
    setControllerId(id:string)
    {
        this.controllerId = id;
    }

    /**
     * Get controller instance
     *
     * @return  {object}    Controller instance
     */
    getController()
    {
        return this.controller;
    }

    /**
     * Set controller instance
     *
     * @param   {object}    controller  Controller instance
     */
    setController(controller:*)
    {
        this.controller = controller;
    }

    /**
     * Get action name
     *
     * @return  {string}                Action name
     */
    getActionName()
    {
        return this.actionName;
    }

    /**
     * Set action name
     *
     * @param   {string}    name        Method name
     */
    setActionName(name:string)
    {
        this.actionName = name;
    }

    /**
     * Get path
     *
     * @return  {string}                Path
     */
    getPath()
    {
        return this.path;
    }

    /**
     * Set path
     *
     * @param   {string}    path        Path
     */
    setPath(path:string)
    {
        this.path = path;
    }

    /**
     * Get URL matcher identifier
     *
     * @return  {string}                Matcher identifier
     */
    getUrlMatcherId()
    {
        return this.urlMatcherId;
    }

    /**
     * Set URL matcher identifier
     *
     * @param   {string}    id          Matcher identifier
     */
    setUrlMatcherId(id:string)
    {
        this.urlMatcherId = id;
    }

    /**
     * get methods
     *
     * @return  {Array}     Methods
     */
    getMethods()
    {
        return this.methods.slice(0);
    }

    /**
     * Add method
     *
     * @param   {string}    name    Method name
     */
    addMethod(name:string)
    {
        let normalizedName:string = name.toUpperCase();

        if (this.methods.indexOf(normalizedName) !== -1) {
            return;
        }

        this.methods.push(normalizedName);
    }
}
