import numpy as np

print(f"NumPy {np.__version__}")
try:
    legacy_alias = np.float_
except AttributeError as exc:
    print(f"LEGACY_API_UNAVAILABLE: {exc}")
else:
    print(f"LEGACY_API_OK: np.float_ -> {legacy_alias.__name__}")

print(f"MEAN_OK: {np.mean([1, 2, 3])}")
print(f"PORTABLE_FIX_OK: {np.dtype(np.float64).name}")
