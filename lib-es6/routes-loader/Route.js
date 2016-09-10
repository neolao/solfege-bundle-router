/**
 * Route definition
 */
export default class Route
{
    /**
     * Constructor
     */
    constructor()
    {
        // Initialize properties
        this.id;
        this.controller;
        this.actionName;
        this.path;
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
    setController(controller)
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
}
