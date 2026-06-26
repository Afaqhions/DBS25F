using backend.Models.DTOs;
using FluentValidation;

namespace backend.Validators
{
    public class CreateCustomerValidator : AbstractValidator<CreateCustomerDto>
    {
        public CreateCustomerValidator()
        {
            RuleFor(c => c.FullName).NotEmpty().MaximumLength(100);
            RuleFor(c => c.Email).NotEmpty().EmailAddress().MaximumLength(200);
            RuleFor(c => c.Password).NotEmpty().MinimumLength(6);
            RuleFor(c => c.Phone).Matches(@"^\+?[\d\s\-\(\)]{7,20}$").When(c => !string.IsNullOrEmpty(c.Phone));
            RuleFor(c => c.DateOfBirth).Must(d => DateTime.UtcNow.Year - d.Year >= 18)
                .WithMessage("Customer must be at least 18 years old.");
        }
    }

    public class UpdateCustomerValidator : AbstractValidator<UpdateCustomerDto>
    {
        public UpdateCustomerValidator()
        {
            RuleFor(c => c.FullName).NotEmpty().MaximumLength(100);
            RuleFor(c => c.Phone).Matches(@"^\+?[\d\s\-\(\)]{7,20}$").When(c => !string.IsNullOrEmpty(c.Phone));
            RuleFor(c => c.DateOfBirth).Must(d => DateTime.UtcNow.Year - d.Year >= 18)
                .WithMessage("Customer must be at least 18 years old.");
        }
    }
}
