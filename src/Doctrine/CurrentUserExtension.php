<?php


namespace App\Doctrine;


use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Core\GraphQl\Resolver\QueryItemResolverInterface;
use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Security;

class CurrentUserExtension implements QueryCollectionExtensionInterface, QueryItemExtensionInterface
{
    /**
     * @var Security
     */
    private $security;
    /**
     * @var AuthorizationCheckerInterface
     */
    private $auth;

    public function __construct(Security $security, AuthorizationCheckerInterface $checker)
    {
        $this->security = $security;
        $this->auth     = $checker;
    }

    private function addWhere(QueryBuilder $queryBuilder, string $resourceClass){
        // Obtenir l'utilisateur connecté
        $user = $this->security->getUser();

        // Si on demande des invoices ou des customers alors on agit sur la requête pour tenir compte du user connecté
        if(($resourceClass === Customer::class || $resourceClass === Invoice::class) &&
            !$this->auth->isGranted('ROLE_ADMIN') && $user instanceof User) {
            $rootAlias = $queryBuilder->getRootAliases()[0];

            if($resourceClass === Customer::class) {
                $queryBuilder->andWhere("$rootAlias.user = :user");
            }elseif ($resourceClass === Invoice::class) {
                $queryBuilder->join("$rootAlias.customer", "c")
                    ->andWhere("c.user = :user");
            }

            $queryBuilder->setParameter("user", $user);

        }
    }

    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, string $operationName = null)
    {
        // TODO: Implement applyToCollection() method.

        $this->addWhere($queryBuilder, $resourceClass);
    }

    /**
     * @inheritDoc
     */
    public function __invoke($item, array $context)
    {
        // TODO: Implement __invoke() method.
    }

    public function applyToItem(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, array $identifiers, string $operationName = null, array $context = [])
    {
        // TODO: Implement applyToItem() method.

        $this->addWhere($queryBuilder, $resourceClass);
    }
}