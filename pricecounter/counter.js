/**
 * Created by sunaiwen on 14-7-7.
 */

// weixin payment maker
if($('.js-PaymentMaker').length!==0){
    //constant component
    var c = {},
    //operate object
        p = {
            init : function(){
                this.initElem();
                this.setAmount();
                this.setTotal();
            },
            initElem : function(){
                this.maker = $('.js-PaymentMaker');
                this.price = $('.js-Price', this.maker);
                this.amount = $('.js-Amount', this.maker);
                this.total = $('.js-TotalPrice', this.maker);
                this.plus = $('.js-Plus', this.maker);
                this.minus = $('.js-Minus', this.maker);
                this.remain = $('.js-Remain', this.maker);
                this.submitAmount = $('.js-SubmitAmount', this.maker);
            },
            setTotal : function(){
                var price = this.getPrice(),
                    amount = this.getAmount();
                this.total.text(price*amount);
            },
            getPrice : function(){
                if(c.price!=undefined) return c.price;

                var priceStr = this.price.text(), currentPrice;
                if(priceStr.charAt(0).match(/\D/)!=null){
                    currentPrice = priceStr.match(/\d|\./g);
                    currentPrice = currentPrice.join('');
                }
                c.price = parseFloat(currentPrice);
                return c.price;
            },
            getAmount : function(){
                var currentAmount = parseInt(this.amount.text());
                return currentAmount;
            },
            setAmount : function(operate){
                var currentAmount = this.getAmount(),
                    remain = this.getRemain();

                if(operate==='plus') currentAmount++;
                else if(operate==='minus') currentAmount--;

                if(currentAmount<=1||!currentAmount) currentAmount=1;
                else if(currentAmount>remain){
                    alert('库存仅剩'+remain+'！');
                    currentAmount = remain;
                }
                else currentAmount = parseInt(currentAmount);

                this.amount.text(currentAmount);

                this.setSubmitAmount(currentAmount);
            },
            // 库存剩余
            getRemain : function(){
                if(c.remain!=undefined) return c.remain;

                var remain = this.remain.val();
                c.remain = parseInt(remain);
                return c.remain;
            },
//            amount to submit
            setSubmitAmount : function(amount){
                var amount = parseInt(amount);
                p.submitAmount.val(amount);
            }
        };

    // init
    p.init();

    //event
    p.plus.on('click', function(){
        p.setAmount('plus');
        p.setTotal();
    });
    p.minus.on('click', function(){
        p.setAmount('minus');
        p.setTotal();
    });
    p.amount.on('blur', function(){
        p.setAmount();
        p.setTotal();
    });
}
