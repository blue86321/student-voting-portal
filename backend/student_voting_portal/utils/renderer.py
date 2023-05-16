from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response


class JSONResponseRenderer(JSONRenderer):

    def render(self, data, accepted_media_type=None, renderer_context=None):
        response: Response = renderer_context.get("response")
        success = 300 <= response.status_code < 400
        response_dict = {
            "success": success,
            "code": response.status_code,
            "data": data if success else {},
            "message": data if not success else {},
        }
        return super().render(response_dict, accepted_media_type, renderer_context)
