import base64

def decode_base64url(base64url_string):
    base64_string = base64url_string.replace('-', '+').replace('_', '/')
    padding = len(base64_string) % 4
    if padding:
        base64_string += '=' * (4 - padding)
    decoded_data = base64.b64decode(base64_string)
    return decoded_data.decode('utf-8')