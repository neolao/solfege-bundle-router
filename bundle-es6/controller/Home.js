import solfege from "solfegejs";

/**
 * The home controller
 *
 * @class   solfege.bundle.router.controller.Home
 */
export default class Home
{
    /**
     * Constructor
     */
    constructor()
    {
    }

    /**
     * Main action
     *
     * @public
     * @param   {solfege.bundle.server.Request}     request     The request
     * @param   {solfege.bundle.server.Response}    response    The response
     */
    *index(request, response)
    {
        response.body = "Homepage";
    }

    /**
     * Hello action
     *
     * @public
     * @param   {solfege.bundle.server.Request}     request     The request
     * @param   {solfege.bundle.server.Response}    response    The response
     */
    *hello(request, response)
    {
        let name = request.getParameter("name");
        let age = request.getParameter("age");

        response.body = `Hello ${name}, I am ${age}.`;
    }

}

