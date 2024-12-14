import builtins

class CustomPrint:
    BOLD = "\033[1m"
    RESET = "\033[0m"
    UNDERLINE = "\033[4m"

    DEFAULT = "\033[37m"
    ERROR = "\033[31m"
    INFO = "\033[34m"
    STATUS = "\033[90m"
    SUCCESS = "\033[32m"

    def __init__(self):
        self.original_print = builtins.print

    def _apply_color(self, text, color):
        return f"{color}{text}{self.RESET}"

    def print(self, message):
        self.original_print(self._apply_color(message, self.DEFAULT))

    def error(self, message):
        self.original_print(self._apply_color(message, self.ERROR))

    def info(self, message):
        self.original_print(self._apply_color(message, self.INFO))

    def status(self, message):
        self.original_print(self._apply_color(message, self.STATUS))

    def success(self, message):
        self.original_print(self._apply_color(message, self.SUCCESS))

custom_print = CustomPrint()
builtins.print = custom_print.print