using backend.Models.DTOs;
using FluentValidation;

namespace backend.Validators
{
    public class CreateOrderValidator : AbstractValidator<CreateOrderDto>
    {
        public CreateOrderValidator()
        {
            RuleFor(o => o.CustomerId).GreaterThan(0);
            RuleFor(o => o.PaymentMethod).NotEmpty();
            RuleFor(o => o.Items).NotEmpty().WithMessage("Order must have at least one item.");
            RuleForEach(o => o.Items).ChildRules(item =>
            {
                item.RuleFor(i => i.ProductId).GreaterThan(0);
                item.RuleFor(i => i.Quantity).GreaterThanOrEqualTo(1);
            });
        }
    }
}
