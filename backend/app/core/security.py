from argon2 import PasswordHasher, exceptions
import re

ph = PasswordHasher(time_cost=2, memory_cost=155648, parallelism=1, salt_len=32)

def hash_password(plain_password: str) -> str:
    """Hash a plain password using Argon2."""
    return ph.hash(plain_password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against the hashed password."""
    try:
        ph.verify(hashed_password, plain_password)
        return True
    except exceptions.VerifyMismatchError:
        return False
    except Exception as e:
        return False

def is_password_strong(password : str) -> bool:
    """Check if a password is strong enough. Must be at least 8 characters long and include uppercase, lowercase, digit, and special character."""
    rule = re.compile(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$")
    # fullmatch returns a Match object if the whole string matches the regex, else None
    return True if rule.fullmatch(password) else False

# Testing
if __name__ == "__main__":
    pwd = input("Enter password to hash: ")
    if is_password_strong(pwd):
        print(hash_password(pwd))
    else:
        print("Password is not strong enough.")