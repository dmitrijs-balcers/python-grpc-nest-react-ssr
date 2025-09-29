"""Setup module for protovalidate compatibility.

This module sets up the necessary module aliases for protovalidate to work
with our proto_generated package structure.
"""

import sys

# Protovalidate expects buf.validate to be a top-level module
# We generate it under proto_generated.buf.validate, so we create aliases
import proto_generated.buf as buf_module
import proto_generated.buf.validate as validate_module

sys.modules['buf'] = buf_module
sys.modules['buf.validate'] = validate_module
