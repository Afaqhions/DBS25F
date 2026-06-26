using backend.Models.DTOs;
using FluentValidation;

namespace backend.Validators
{
    public class CreateProductValidator : AbstractValidator<CreateProductDto>
    {
        public CreateProductValidator()
        {
            RuleFor(p => p.Name).NotEmpty().MaximumLength(100);
            RuleFor(p => p.Price).GreaterThan(0).WithMessage("Price must be greater than 0.");
            RuleFor(p => p.StockQuantity).GreaterThanOrEqualTo(0);
            RuleFor(p => p.CategoryId).GreaterThan(0);
        }
    }

    public class UpdateProductValidator : AbstractValidator<UpdateProductDto>
    {
        public UpdateProductValidator()
        {
            RuleFor(p => p.Name).NotEmpty().MaximumLength(100);
            RuleFor(p => p.Price).GreaterThan(0).WithMessage("Price must be greater than 0.");
            RuleFor(p => p.StockQuantity).GreaterThanOrEqualTo(0);
            RuleFor(p => p.CategoryId).GreaterThan(0);
        }
    }
}
