/**
 * Default controller
 */
export default class DefaultController
{
    /**
     * Homepage
     *
     * @param   {Request}   request     HTTP request
     * @param   {Response}  response    HTTP response
     */
    *index(request, response)
    {
        console.log("Homepage");
    }

    /**
     * Contact page
     *
     * @param   {Request}   request     HTTP request
     * @param   {Response}  response    HTTP response
     */
    *contact(request, response)
    {
        console.log("Contact");

        response.body = "Contact page";
    }
}
